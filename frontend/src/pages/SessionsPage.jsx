import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  LoaderCircle,
  Plus,
  RefreshCw,
  Video,
  X,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getFullPhotoUrl, getProfileByUserId } from '../services/profileApi';
import {
  getReceivedRequests,
  getRequestServiceSkills,
  getSentRequests,
} from '../services/skillSwapRequestApi';
import {
  cancelSession,
  completeSession,
  createSessionFromRequest,
  getSessionsForUser,
  scheduleSession,
  toSessionUuid,
} from '../services/sessionApi';

const SESSION_STATUS = {
  PENDING: { label: 'Needs a time', variant: 'amber' },
  SCHEDULED: { label: 'Scheduled', variant: 'sky' },
  ACTIVE: { label: 'In progress', variant: 'emerald' },
  COMPLETED: { label: 'Completed', variant: 'slate' },
  CANCELLED: { label: 'Cancelled', variant: 'rose' },
};

const dateLabel = (value) => {
  if (!value) return 'Choose a date';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

const timeLabel = (value) => (value ? value.slice(0, 5) : '');

const SessionCard = ({ item, userId, busy, onCreate, onSchedule, onCancel, onComplete }) => {
  const { session, request } = item;
  const isIncoming = Number(request?.receiverId) === Number(userId);
  const person = item.person;
  const status = SESSION_STATUS[session?.status] || { label: 'Accepted request', variant: 'amber' };
  const form = item.form;

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Avatar
          src={getFullPhotoUrl(person?.profilePhoto)}
          name={person?.name || `User ${isIncoming ? request.senderId : request.receiverId}`}
          size="lg"
        />
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {isIncoming ? 'Learning with' : 'Teaching with'}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {person?.name || `User #${isIncoming ? request.senderId : request.receiverId}`}
              </h2>
            </div>
            <Badge variant={status.variant} dot>{status.label}</Badge>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-2">
              <Video className="h-4 w-4 text-terracotta-500" />
              {item.skillName || 'Skill exchange'}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-terracotta-500" />
              {dateLabel(session?.sessionDate || request.requestedDate)}
            </span>
            {(session?.startTime || request.requestedStartTime) && (
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-terracotta-500" />
                {timeLabel(session?.startTime || request.requestedStartTime)}
                {(session?.endTime || request.requestedEndTime) && ` – ${timeLabel(session?.endTime || request.requestedEndTime)}`}
              </span>
            )}
          </div>

          {!session ? (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">This accepted swap is ready to turn into a video session.</p>
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} isLoading={busy === `create-${request.id}`} onClick={() => onCreate(request, item.skillName)}>
                Create session
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {session.status === 'PENDING' && (
                <form className="grid gap-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end" onSubmit={(event) => { event.preventDefault(); onSchedule(session.sessionId, form); }}>
                  <label className="space-y-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Date
                    <input required type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={(event) => form.onChange('date', event.target.value)} className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                  </label>
                  <label className="space-y-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Starts
                    <input required type="time" value={form.startTime} onChange={(event) => form.onChange('startTime', event.target.value)} className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                  </label>
                  <label className="space-y-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Ends
                    <input required type="time" value={form.endTime} onChange={(event) => form.onChange('endTime', event.target.value)} className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
                  </label>
                  <Button size="sm" type="submit" leftIcon={<Check className="h-4 w-4" />} isLoading={busy === `schedule-${session.sessionId}`}>Save time</Button>
                </form>
              )}
              <div className="flex flex-wrap gap-2">
                {session.meetingLink && session.status !== 'CANCELLED' && session.status !== 'COMPLETED' && (
                  <a href={session.meetingLink} target="_blank" rel="noreferrer">
                    <Button size="sm" leftIcon={<ExternalLink className="h-4 w-4" />}>Open video room</Button>
                  </a>
                )}
                {session.status === 'SCHEDULED' && (
                  <Button size="sm" variant="secondary" leftIcon={<X className="h-4 w-4" />} isLoading={busy === `cancel-${session.sessionId}`} onClick={() => onCancel(session.sessionId)}>Cancel session</Button>
                )}
                {session.status === 'ACTIVE' && (
                  <Button size="sm" variant="secondary" leftIcon={<Check className="h-4 w-4" />} isLoading={busy === `complete-${session.sessionId}`} onClick={() => onComplete(session.sessionId)}>Mark complete</Button>
                )}
              </div>
            </div>
          )}
          {request.message && <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">{request.message}</p>}
        </div>
      </div>
    </Card>
  );
};

const SessionsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const userId = user?.id;
  const [sessions, setSessions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [people, setPeople] = useState({});
  const [skills, setSkills] = useState({});
  const [forms, setForms] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const loadSessions = useCallback(async ({ refresh = false } = {}) => {
    if (userId == null) return;
    if (refresh) setIsRefreshing(true);
    try {
      const [sessionRows, receivedRows, sentRows, skillRows] = await Promise.all([
        getSessionsForUser(userId),
        getReceivedRequests(userId),
        getSentRequests(userId),
        getRequestServiceSkills().catch(() => []),
      ]);
      const accepted = [...(Array.isArray(receivedRows) ? receivedRows : []), ...(Array.isArray(sentRows) ? sentRows : [])]
        .filter((request) => ['ACCEPTED', 'SCHEDULED'].includes(request.status));
      setSessions(Array.isArray(sessionRows) ? sessionRows : []);
      setRequests(accepted);
      setSkills(Object.fromEntries((Array.isArray(skillRows) ? skillRows : []).map((skill) => [String(skill.id), skill.name])));
      setError('');

      const otherIds = [...new Set(accepted.map((request) => Number(request.senderId) === Number(userId) ? request.receiverId : request.senderId))];
      const profiles = await Promise.all(otherIds.map(async (id) => {
        try { return [String(id), await getProfileByUserId(id)]; }
        catch { return [String(id), null]; }
      }));
      setPeople(Object.fromEntries(profiles));
    } catch (loadError) {
      setError(loadError.message || 'Could not load sessions. Check that the session and request services are running.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId]);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  const withAction = async (key, action, successMessage) => {
    setBusy(key);
    try {
      await action();
      showToast({ message: successMessage, type: 'success' });
      await loadSessions({ refresh: true });
    } catch (actionError) {
      showToast({ message: actionError.message || 'Could not update the session.', type: 'error', duration: 5000 });
    } finally {
      setBusy('');
    }
  };

  const handleCreate = (request, skillName) => withAction(
    `create-${request.id}`,
    () => createSessionFromRequest({ requestId: request.id, senderId: request.senderId, receiverId: request.receiverId, skillName: skillName || `Skill #${request.skillId}` }),
    'Session created. Choose a time below.',
  );

  const handleSchedule = (sessionId, form) => {
    if (form.endTime <= form.startTime) {
      showToast({ message: 'End time must be later than start time.', type: 'error' });
      return;
    }
    return withAction(`schedule-${sessionId}`, () => scheduleSession(sessionId, {
      sessionDate: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
    }), 'Session scheduled.');
  };

  const items = useMemo(() => {
    const sessionByRequest = new Map(sessions.map((session) => [String(session.requestId).toLowerCase(), session]));
    const requestItems = requests.map((request) => {
      const counterpartId = Number(request.senderId) === Number(userId) ? request.receiverId : request.senderId;
      let requestUuid = '';
      try { requestUuid = toSessionUuid(request.id).toLowerCase(); } catch { /* ignore malformed data */ }
      return {
        request,
        session: sessionByRequest.get(requestUuid) || null,
        person: people[String(counterpartId)],
        skillName: skills[String(request.skillId)] || `Skill #${request.skillId}`,
      };
    });
    const includedIds = new Set(requestItems.map((item) => item.session?.sessionId).filter(Boolean));
    const additionalSessions = sessions
      .filter((session) => !includedIds.has(session.sessionId))
      .map((session) => {
        const counterpartId = Number(session.senderId) === Number(userId) ? session.receiverId : session.senderId;
        return {
          session,
          request: { id: session.requestId, senderId: session.senderId, receiverId: session.receiverId },
          person: people[String(counterpartId)],
          skillName: session.skillName,
        };
      });
    return [...requestItems.map((item) => item.session ? item : { ...item, session: null }), ...additionalSessions]
      .map((item) => {
        const key = item.session?.sessionId || `request-${item.request.id}`;
        const current = forms[key] || {
          date: item.session?.sessionDate || item.request.requestedDate || '',
          startTime: timeLabel(item.session?.startTime || item.request.requestedStartTime),
          endTime: timeLabel(item.session?.endTime || item.request.requestedEndTime),
        };
        return {
          ...item,
          form: {
            ...current,
            onChange: (field, value) => setForms((old) => ({ ...old, [key]: { ...current, [field]: value } })),
          },
        };
      })
      .sort((a, b) => (a.session?.sessionDate || a.request.requestedDate || '9999').localeCompare(b.session?.sessionDate || b.request.requestedDate || '9999'));
  }, [sessions, requests, people, skills, userId, forms]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-terracotta-600 dark:text-terracotta-400">Learn together</p>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">Video Sessions</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Schedule accepted swaps, join video rooms, and keep track of your sessions.</p>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />} onClick={() => loadSessions({ refresh: true })} disabled={isLoading || isRefreshing}>
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="flex flex-col items-start justify-between gap-4 border-rose-500/30 bg-rose-500/5 p-5 sm:flex-row sm:items-center">
          <div><h2 className="font-semibold text-rose-700 dark:text-rose-300">Sessions could not be loaded</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{error}</p></div>
          <Button size="sm" variant="outline" onClick={() => loadSessions({ refresh: true })}>Try again</Button>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /> Loading sessions…</div>
      ) : !error && items.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-300"><CalendarDays className="h-7 w-7" /></span>
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">No sessions yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">When a swap request is accepted, it will appear here so you can create and schedule a video session.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <SessionCard
              key={item.session?.sessionId || `request-${item.request.id}`}
              item={item}
              userId={userId}
              busy={busy}
              onCreate={handleCreate}
              onSchedule={handleSchedule}
              onCancel={(id) => withAction(`cancel-${id}`, () => cancelSession(id), 'Session cancelled.')}
              onComplete={(id) => withAction(`complete-${id}`, () => completeSession(id), 'Session marked complete.')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
