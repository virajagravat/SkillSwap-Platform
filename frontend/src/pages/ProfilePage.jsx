import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Camera, Edit, Mail, Plus, Save, Sparkles, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const PROFILE_API_URL = import.meta.env.VITE_PROFILE_API_URL || 'http://localhost:8087';

const requestJson = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    mode: 'cors',
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      message = await response.text();
    }
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

const getPhotoUrl = (photo) => {
  if (!photo) return '';
  if (photo.startsWith('http')) return photo;
  return `${PROFILE_API_URL}/uploads/profiles/${photo}`;
};

const ProfilePage = () => {
  const { user } = useAuth();
  const { error: showError, success: showSuccess } = useToast();
  const [profile, setProfile] = useState(null);
  const [profileSkills, setProfileSkills] = useState([]);
  const [name, setName] = useState('');
  const [teachSkill, setTeachSkill] = useState('');
  const [learnSkill, setLearnSkill] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const groupedSkills = useMemo(
    () => ({
      TEACH: profileSkills.filter((item) => item.skillType === 'TEACH'),
      LEARN: profileSkills.filter((item) => item.skillType === 'LEARN'),
    }),
    [profileSkills]
  );

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        let loadedProfile;
        try {
          loadedProfile = await requestJson(`${PROFILE_API_URL}/api/profiles/user/${user.id}`);
        } catch (error) {
          if (!error.message.toLowerCase().includes('not found')) throw error;
          loadedProfile = await requestJson(`${PROFILE_API_URL}/api/profiles`, {
            method: 'POST',
            body: JSON.stringify({
              userId: user.id,
              name: user.fullName || 'SkillSwap User',
              profilePhoto: user.avatarUrl || '',
            }),
          });
        }

        const skills = await requestJson(`${PROFILE_API_URL}/api/profiles/${loadedProfile.id}/skills`);
        setProfile(loadedProfile);
        setName(loadedProfile.name || user.fullName || '');
        setProfileSkills(skills);
      } catch (error) {
        console.error('PROFILE LOAD ERROR:', error);
        showError(`Profile load failed: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [showError, user]);

  const saveProfile = async () => {
    if (!profile || !name.trim()) return;

    setIsSaving(true);
    try {
      const updatedProfile = await requestJson(`${PROFILE_API_URL}/api/profiles/${profile.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim(),
          profilePhoto: profile.profilePhoto,
        }),
      });
      setProfile(updatedProfile);
      showSuccess('Profile updated');
    } catch (error) {
      console.error('PROFILE UPDATE ERROR:', error);
      showError(`Profile update failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!profile || !file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setIsSaving(true);
    try {
      const updatedProfile = await requestJson(`${PROFILE_API_URL}/api/profiles/${profile.id}/photo`, {
        method: 'POST',
        body: formData,
      });
      setProfile(updatedProfile);
      showSuccess('Photo updated');
    } catch (error) {
      console.error('PHOTO UPLOAD ERROR:', error);
      showError(`Photo upload failed: ${error.message}`);
    } finally {
      event.target.value = '';
      setIsSaving(false);
    }
  };

  const addSkill = async (skillType) => {
    if (!profile) return;

    const value = (skillType === 'TEACH' ? teachSkill : learnSkill).trim();
    if (!value) return;

    setIsSaving(true);
    try {
      const skill = await requestJson(`${PROFILE_API_URL}/api/skills`, {
        method: 'POST',
        body: JSON.stringify({ name: value }),
      });
      const addedSkill = await requestJson(`${PROFILE_API_URL}/api/profiles/${profile.id}/skills`, {
        method: 'POST',
        body: JSON.stringify({ skillId: skill.id, skillType }),
      });
      setProfileSkills((current) => [...current, addedSkill]);
      skillType === 'TEACH' ? setTeachSkill('') : setLearnSkill('');
      showSuccess('Skill added');
    } catch (error) {
      console.error('SKILL ADD ERROR:', error);
      showError(`Skill add failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const removeSkill = async (skillId, skillType) => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const response = await fetch(`${PROFILE_API_URL}/api/profiles/${profile.id}/skills/${skillId}?skillType=${skillType}`, {
        method: 'DELETE',
        mode: 'cors',
      });
      if (!response.ok) throw new Error('Skill remove failed');
      setProfileSkills((current) => current.filter((item) => item.skill.id !== skillId || item.skillType !== skillType));
      showSuccess('Skill removed');
    } catch (error) {
      console.error('SKILL REMOVE ERROR:', error);
      showError(`Skill remove failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-slate-500 dark:text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50">
          User Profile Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, availability, and skills.
        </p>
      </div>

      {user && profile && (
        <Card glass className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar name={name || user.fullName} src={getPhotoUrl(profile.profilePhoto) || user.avatarUrl} size="xl" status="online" />
                <label className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-terracotta-600 text-white shadow-md">
                  <Camera className="h-4 w-4" />
                  <input type="file" accept="image/*" className="sr-only" onChange={uploadPhoto} disabled={isSaving} />
                </label>
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100">
                  {profile.name}
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="terracotta" size="sm">
                    {user.swapsCompleted || 0} Swaps Completed
                  </Badge>
                  <Badge variant="amber" size="sm">
                    {user.rating || 5.0} Rating
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-80">
              <Input value={name} onChange={(event) => setName(event.target.value)} leftIcon={<Edit className="w-4 h-4" />} />
              <Button onClick={saveProfile} isLoading={isSaving} size="sm" leftIcon={<Save className="w-4 h-4" />}>
                Save Profile
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <SkillColumn
              icon={<Sparkles className="w-4 h-4 text-emerald-500" />}
              title="Skills You Can Teach"
              variant="emerald"
              value={teachSkill}
              onChange={setTeachSkill}
              onAdd={() => addSkill('TEACH')}
              onRemove={removeSkill}
              skills={groupedSkills.TEACH}
              disabled={isSaving}
            />
            <SkillColumn
              icon={<BookOpen className="w-4 h-4 text-terracotta-500" />}
              title="Skills You Want to Learn"
              variant="terracotta"
              value={learnSkill}
              onChange={setLearnSkill}
              onAdd={() => addSkill('LEARN')}
              onRemove={removeSkill}
              skills={groupedSkills.LEARN}
              disabled={isSaving}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

const SkillColumn = ({ icon, title, variant, value, onChange, onAdd, onRemove, skills, disabled }) => (
  <div className="space-y-3">
    <h4 className="text-xs uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
      {icon} {title}
    </h4>
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onAdd();
        }}
        placeholder="Add a skill"
        disabled={disabled}
      />
      <Button size="md" onClick={onAdd} disabled={disabled} leftIcon={<Plus className="w-4 h-4" />}>
        Add
      </Button>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {skills.length ? (
        skills.map((item) => (
          <Badge key={item.id} variant={variant}>
            <span className="inline-flex items-center gap-1">
              {item.skill.name}
              <button type="button" onClick={() => onRemove(item.skill.id, item.skillType)} className="rounded-full hover:bg-black/10">
                <X className="h-3 w-3" />
              </button>
            </span>
          </Badge>
        ))
      ) : (
        <span className="text-sm text-slate-400">No skills yet</span>
      )}
    </div>
  </div>
);

export default ProfilePage;
