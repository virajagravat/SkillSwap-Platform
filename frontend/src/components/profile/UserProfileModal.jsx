import React, { useState, useEffect } from 'react';
import { X, User, BookOpen, Sparkles, Send, Award, Calendar, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { getProfileByUserId, getProfileSkills, getFullPhotoUrl } from '../../services/profileApi';

const UserProfileModal = ({ isOpen, onClose, userId, teacherName, offeredSkillName, onSendSwapRequest }) => {
  const [profileData, setProfileData] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchTeacherProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch full profile by userId
        const prof = await getProfileByUserId(userId);
        if (prof) {
          setProfileData(prof);
          // Fetch skills associated with this profile
          const skillsList = await getProfileSkills(prof.id);
          setUserSkills(skillsList || []);
        } else {
          // Fallback basic profile
          setProfileData({
            userId,
            name: teacherName || 'Peer Educator',
            profilePhoto: null,
            createdAt: new Date().toISOString(),
          });
          setUserSkills([]);
        }
      } catch (err) {
        console.warn('Could not fetch full profile details:', err);
        setError('Could not load complete profile details.');
        setProfileData({
          userId,
          name: teacherName || 'Peer Educator',
          profilePhoto: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [isOpen, userId, teacherName]);

  if (!isOpen) return null;

  const teachSkills = userSkills.filter((s) => s.skillType === 'TEACH');
  const learnSkills = userSkills.filter((s) => s.skillType === 'LEARN');

  const photoUrl = profileData?.profilePhoto ? getFullPhotoUrl(profileData.profilePhoto) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Background Accent */}
        <div className="h-28 bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-terracotta-700 relative p-6 flex items-start justify-between">
          <Badge variant="terracotta" size="sm" className="bg-white/20 text-white border-white/30 backdrop-blur-xs">
            Peer Educator Profile
          </Badge>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Avatar & Primary Info */}
        <div className="px-6 relative -mt-12 space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-end justify-between">
            <Avatar
              src={photoUrl}
              name={profileData?.name || teacherName}
              size="xl"
              status="online"
              className="w-24 h-24 text-2xl ring-4 ring-white dark:ring-slate-900 shadow-lg"
            />
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onSendSwapRequest?.(profileData?.name || teacherName, offeredSkillName);
              }}
              className="shadow-md"
            >
              Send Swap Request
            </Button>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              {profileData?.name || teacherName}
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
              <span>User ID: #{userId}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-terracotta-600 dark:text-terracotta-400 font-medium">
                <Award className="w-3.5 h-3.5" /> Verified Skill Swapper
              </span>
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-terracotta-500 mx-auto" />
              <p className="text-xs text-slate-500">Loading teacher profile details...</p>
            </div>
          ) : (
            <>
              {/* Featured Offered Skill Banner */}
              {offeredSkillName && (
                <div className="p-4 rounded-2xl bg-terracotta-500/10 border border-terracotta-500/20 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold tracking-wider text-terracotta-600 dark:text-terracotta-400 uppercase">
                      Offered Skill in Search
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{offeredSkillName}</h4>
                  </div>
                  <Badge variant="terracotta" size="md" dot>
                    TEACH
                  </Badge>
                </div>
              )}

              {/* Skills Offered to Teach */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-500" /> Skills Ready to Teach ({teachSkills.length || 1})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {teachSkills.length > 0 ? (
                    teachSkills.map((s, idx) => (
                      <Badge key={s.id || idx} variant="emerald" size="md" dot>
                        {s.skill?.name || s.name || offeredSkillName}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="emerald" size="md" dot>
                      {offeredSkillName}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Skills Wanting to Learn */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-500" /> Skills Wanting to Learn ({learnSkills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {learnSkills.length > 0 ? (
                    learnSkills.map((s, idx) => (
                      <Badge key={s.id || idx} variant="sky" size="md">
                        {s.skill?.name || s.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No specific learning goals listed yet.</span>
                  )}
                </div>
              </div>

              {/* Account Stats & Overview */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Member Since
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'September 2026'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> Rating & Reviews
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">5.0 ★★★★★ (New Teacher)</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
