import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Inbox,
  RefreshCw,
  Send,
  X,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getProfileByUserId, getFullPhotoUrl } from '../services/profileApi';
import {
  acceptSwapRequest,
  getReceivedRequests,
  getRequestServiceSkills,
  getSentRequests,
  rejectSwapRequest,
} from '../services/skillSwapRequestApi';

const STATUS_STYLES = {
  PENDING: { label: 'Pending', variant: 'amber' },
  TIME_SUGGESTED: { label: 'Time suggested', variant: 'sky' },
  PARTICIPANT_SUGGESTED: { label: 'Time suggested', variant: 'sky' },
  ACCEPTED: { label: 'Accepted', variant: 'emerald' },
  SCHEDULED: { label: 'Scheduled', variant: 'sky' },
  REJECTED: { label: 'Declined', variant: 'rose' },
  CANCELLED: { label: 'Cancelled', variant: 'slate' },
  COMPLETED: { label: 'Completed', variant: 'emerald' },
};

const formatDate = (value) => {
  if (!value) return 'Date not set';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (value) => (value ? value.slice(0, 5) : '');

const SwapRequestCard = ({ request, direction, counterpart, skillName, busy, onAction }) => {
  const isIncoming = direction === 'received';
  const status = STATUS_STYLES[request.status] || { label: request.status || 'Unknown', variant: 'slate' };
  const canRespond = isIncoming && request.status === 'PENDING';

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Avatar
          src={getFullPhotoUrl(counterpart?.profilePhoto)}
          name={counterpart?.name || `User ${isIncoming ? request.senderId : request.receiverId}`}
          size="lg"
        />
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {isIncoming ? 'Request from' : 'Request to'}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {counterpart?.name || `User #${isIncoming ? request.senderId : request.receiverId}`}
              </h2>
            </div>
            <Badge variant={status.variant} dot>{status.label}</Badge>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-2">
              <Inbox className="h-4 w-4 text-terracotta-500" />
              {skillName || `Skill #${request.skillId}`}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-terracotta-500" />
              {formatDate(request.requestedDate)}
            </span>
            {(request.requestedStartTime || request.requestedEndTime) && (
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-terracotta-500" />
                {formatTime(request.requestedStartTime)}
                {request.requestedEndTime && ` – ${formatTime(request.requestedEndTime)}`}
              </span>
            )}
          </div>

          {request.message && (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              “{request.message}”
            </p>
          )}

          {canRespond && (
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                size="sm"
                leftIcon={<Check className="h-4 w-4" />}
                isLoading={busy === 'accept'}
                disabled={Boolean(busy)}
                onClick={() => onAction(request, 'accept')}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="danger"
                leftIcon={<X className="h-4 w-4" />}
                isLoading={busy === 'reject'}
                disabled={Boolean(busy)}
                onClick={() => onAction(request, 'reject')}
              >
                Decline
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const SkillRequestsPage = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('received');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [people, setPeople] = useState({});
  const [skills, setSkills] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [busyRequest, setBusyRequest] = useState(null);

  const loadRequests = useCallback(async ({ refresh = false } = {}) => {
    if (!userId) return;
    if (refresh) setIsRefreshing(true);

    try {
      const [receivedRows, sentRows, skillRows] = await Promise.all([
        getReceivedRequests(userId),
        getSentRequests(userId),
        getRequestServiceSkills().catch((err) => {
          console.warn('Could not load request skill names:', err.message);
          return [];
        }),
      ]);
      const safeReceived = Array.isArray(receivedRows) ? receivedRows : [];
      const safeSent = Array.isArray(sentRows) ? sentRows : [];
      setError('');
      setReceived(safeReceived);
      setSent(safeSent);
      setSkills(Object.fromEntries((Array.isArray(skillRows) ? skillRows : []).map((skill) => [String(skill.id), skill.name])));

      const counterpartIds = [...new Set([
        ...safeReceived.map((request) => request.senderId),
        ...safeSent.map((request) => request.receiverId),
      ].filter((id) => id != null).map(String))];
      const profiles = await Promise.all(counterpartIds.map(async (id) => {
        try {
          return [id, await getProfileByUserId(id)];
        } catch (err) {
          console.warn(`Could not load profile for user ${id}:`, err.message);
          return [id, null];
        }
      }));
      setPeople(Object.fromEntries(profiles));
    } catch (err) {
      console.error('Could not load skill swap requests:', err);
      setError(err.message || 'Could not load requests. Please check the request service and try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) loadRequests();
    });
    return () => {
      cancelled = true;
    };
  }, [loadRequests]);

  const handleAction = async (request, action) => {
    setBusyRequest({ id: request.id, action });
    try {
      if (action === 'accept') await acceptSwapRequest(request.id, user.id);
      else await rejectSwapRequest(request.id, user.id);
      showToast({
        message: action === 'accept' ? 'Request accepted.' : 'Request declined.',
        type: 'success',
      });
      await loadRequests({ refresh: true });
    } catch (err) {
      showToast({ message: err.message || `Could not ${action} this request.`, type: 'error', duration: 5000 });
    } finally {
      setBusyRequest(null);
    }
  };

  const activeRequests = activeTab === 'received' ? received : sent;
  const visibleRequests = useMemo(() => [...activeRequests].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.requestedDate || 0).getTime();
    const dateB = new Date(b.createdAt || b.requestedDate || 0).getTime();
    return dateB - dateA;
  }), [activeRequests]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-terracotta-600 dark:text-terracotta-400">Your skill exchanges</p>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">Swap Requests</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review incoming requests and keep track of the ones you sent.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={() => loadRequests({ refresh: true })}
            disabled={isLoading || isRefreshing}
          >
            Refresh
          </Button>
          <Link to="/skills">
            <Button size="sm" leftIcon={<Send className="h-4 w-4" />}>Find a skill</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="flex items-center gap-3 p-4 sm:p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300"><ArrowDownLeft className="h-5 w-5" /></span>
          <div><p className="text-xl font-bold text-slate-900 dark:text-slate-100">{received.length}</p><p className="text-xs text-slate-500 dark:text-slate-400">Received</p></div>
        </Card>
        <Card className="flex items-center gap-3 p-4 sm:p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-300"><ArrowUpRight className="h-5 w-5" /></span>
          <div><p className="text-xl font-bold text-slate-900 dark:text-slate-100">{sent.length}</p><p className="text-xs text-slate-500 dark:text-slate-400">Sent</p></div>
        </Card>
      </div>

      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'received', label: 'Received', badge: received.length, icon: <ArrowDownLeft /> },
          { id: 'sent', label: 'Sent', badge: sent.length, icon: <ArrowUpRight /> },
        ]}
      />

      {error && (
        <Card className="flex flex-col items-start justify-between gap-4 border-rose-500/30 bg-rose-500/5 p-5 sm:flex-row sm:items-center">
          <div><h2 className="font-semibold text-rose-700 dark:text-rose-300">Requests could not be loaded</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{error}</p></div>
          <Button size="sm" variant="outline" onClick={() => loadRequests({ refresh: true })}>Try again</Button>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3" aria-label="Loading requests">
          {[1, 2].map((item) => <Card key={item} className="h-40 animate-pulse bg-slate-100 dark:bg-slate-800" />)}
        </div>
      ) : !error && visibleRequests.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-300"><Inbox className="h-7 w-7" /></span>
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
            {activeTab === 'received' ? 'No requests received yet' : 'You have not sent any requests'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {activeTab === 'received'
              ? 'When someone requests a skill from you, it will show up here.'
              : 'Browse skills and send a swap request to start learning from the community.'}
          </p>
          {activeTab === 'sent' && <Link to="/skills" className="mt-5 inline-flex"><Button size="sm" leftIcon={<Send className="h-4 w-4" />}>Browse skills</Button></Link>}
        </Card>
      ) : (
        <div className="space-y-3">
          {visibleRequests.map((request) => {
            const counterpartId = activeTab === 'received' ? request.senderId : request.receiverId;
            const busy = busyRequest?.id === request.id ? busyRequest.action : null;
            return (
              <SwapRequestCard
                key={request.id}
                request={request}
                direction={activeTab}
                counterpart={people[String(counterpartId)]}
                skillName={skills[String(request.skillId)]}
                busy={busy}
                onAction={handleAction}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillRequestsPage;
