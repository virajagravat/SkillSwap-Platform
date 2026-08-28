import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Sparkles,
  BookOpen,
  Edit,
  Mail,
  Camera,
  Plus,
  X,
  Search,
  CheckCircle2,
  Trash2,
  Loader2,
  RefreshCw,
  Award,
  Globe
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  getProfileByUserId,
  createProfile,
  updateProfile,
  uploadProfilePhoto,
  getProfileSkills,
  addSkillToProfile,
  removeSkillFromProfile,
  searchSkills,
  createSkill,
  getFullPhotoUrl
} from '../services/profileApi';

const ProfilePage = () => {
  const { user, updateProfile: updateAuthUser } = useAuth();
  const { showToast } = useToast();

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState('teach'); // 'teach' | 'learn' | 'settings'

  // Edit Profile Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Add Skill Modal
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const [skillTypeToAdd, setSkillTypeToAdd] = useState('TEACH'); // 'TEACH' | 'LEARN'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);

  const fileInputRef = useRef(null);

  // Load Profile and Skills from backend profile-service
  const loadProfileData = async () => {
    setLoading(true);
    const currentUserId = user?.id || 1;
    const defaultProfile = {
      id: null,
      userId: currentUserId,
      name: user?.fullName || 'SkillSwap Member',
      profilePhoto: user?.avatarUrl || ''
    };

    try {
      let userProfile = await getProfileByUserId(currentUserId);

      // If no profile exists yet for this user in profile-service, auto-create it
      if (!userProfile) {
        try {
          userProfile = await createProfile({
            userId: currentUserId,
            name: user?.fullName || 'SkillSwap Member',
            profilePhoto: user?.avatarUrl || ''
          });
        } catch (createErr) {
          console.warn('Could not auto-create profile:', createErr);
          userProfile = defaultProfile;
        }
      }

      const activeProfile = userProfile || defaultProfile;
      setProfile(activeProfile);
      setEditName(activeProfile.name || '');

      // Sync name & photo with AuthContext so Navbar updates
      if (updateAuthUser && activeProfile?.name) {
        updateAuthUser({
          fullName: activeProfile.name,
          avatarUrl: getFullPhotoUrl(activeProfile.profilePhoto) || user?.avatarUrl
        });
      }

      // Load Profile Skills
      if (activeProfile?.id) {
        try {
          const profileSkills = await getProfileSkills(activeProfile.id);
          setSkills(profileSkills || []);
        } catch (skillErr) {
          console.warn('Skills load error:', skillErr);
          setSkills([]);
        }
      }
    } catch (error) {
      console.warn('Backend connection warning:', error);
      setProfile(defaultProfile);
      setEditName(defaultProfile.name);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [user?.id]);

  // Ensure active profile ID exists or create it
  const ensureProfileId = async () => {
    if (profile?.id) return profile.id;
    const currentUserId = user?.id || 1;
    const created = await createProfile({
      userId: currentUserId,
      name: profile?.name || user?.fullName || 'SkillSwap Member',
      profilePhoto: profile?.profilePhoto || ''
    });
    setProfile(created);
    return created.id;
  };

  // Handle Photo Upload (Instagram camera click)
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be under 5MB', 'error');
      return;
    }

    setUploadingPhoto(true);
    try {
      const profileId = await ensureProfileId();
      const updatedProfile = await uploadProfilePhoto(profileId, file);
      setProfile(updatedProfile);

      // Sync with top Navbar in real-time
      if (updateAuthUser) {
        updateAuthUser({
          fullName: updatedProfile.name,
          avatarUrl: getFullPhotoUrl(updatedProfile.profilePhoto)
        });
      }

      showToast('Profile photo updated successfully!', 'success');
    } catch (error) {
      console.error('Photo upload failed:', error);
      showToast(error.message || 'Failed to upload photo (Make sure profile-service on 8088 is running)', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle Update Profile Name
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    setUpdatingProfile(true);
    try {
      const profileId = await ensureProfileId();
      const updated = await updateProfile(profileId, {
        name: editName.trim(),
        profilePhoto: profile?.profilePhoto || '',
        userId: profile?.userId || user?.id || 1
      });
      setProfile(updated);
      setIsEditModalOpen(false);

      // Sync with top Navbar in real-time
      if (updateAuthUser) {
        updateAuthUser({
          fullName: updated.name,
          avatarUrl: getFullPhotoUrl(updated.profilePhoto) || user?.avatarUrl
        });
      }

      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Update profile error:', error);
      showToast(error.message || 'Failed to update profile', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Search Skills for Modal
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchSkills(searchQuery.trim());
        setSearchResults(results || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Add Skill to Profile
  const handleSelectSkillToAdd = async (skillItem) => {
    setAddingSkill(true);
    try {
      let targetSkill = skillItem;

      // If user typed a new skill name that doesn't exist in search results
      if (typeof skillItem === 'string') {
        targetSkill = await createSkill(skillItem.trim());
      }

      await addSkillToProfile(profile.id, targetSkill.id, skillTypeToAdd);
      showToast(`Added "${targetSkill.name}" to skills!`, 'success');
      
      // Reload skills list
      const updatedSkills = await getProfileSkills(profile.id);
      setSkills(updatedSkills || []);
      setIsAddSkillModalOpen(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Add skill error:', error);
      showToast(error.message || 'Failed to add skill', 'error');
    } finally {
      setAddingSkill(false);
    }
  };

  // Remove Skill from Profile
  const handleRemoveSkill = async (skillId, skillName) => {
    try {
      await removeSkillFromProfile(profile.id, skillId);
      setSkills((prev) => prev.filter((item) => item.skill.id !== skillId));
      showToast(`Removed "${skillName}"`, 'info');
    } catch (error) {
      console.error('Remove skill error:', error);
      showToast(error.message || 'Failed to remove skill', 'error');
    }
  };

  const teachSkills = skills.filter((s) => s.skillType === 'TEACH');
  const learnSkills = skills.filter((s) => s.skillType === 'LEARN');

  const avatarSrc = getFullPhotoUrl(profile?.profilePhoto) || user?.avatarUrl;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-terracotta-500" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading Profile Service...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* Instagram Cover Header Banner */}
      <div className="relative rounded-2xl overflow-hidden glass-card shadow-lg">
        <div className="h-36 sm:h-48 bg-gradient-to-r from-terracotta-600 via-amber-500 to-emerald-600 relative">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-md"
              onClick={loadProfileData}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync
            </Button>
          </div>
        </div>

        {/* Profile Info Header Content */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            
            {/* Instagram Style Avatar with Camera Badge */}
            <div className="relative group self-start">
              <div className="relative p-1 bg-white dark:bg-slate-900 rounded-full shadow-xl">
                <Avatar
                  name={profile?.name || user?.fullName}
                  src={avatarSrc}
                  size="xl"
                  className="w-24 h-24 sm:w-32 sm:h-32 text-2xl border-2 border-white dark:border-slate-800"
                />
                
                {/* Camera Overlay Icon (Instagram Style) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute bottom-1 right-1 p-2 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full shadow-md transition-all duration-200 hover:scale-110 focus:outline-none ring-2 ring-white dark:ring-slate-900"
                  title="Upload New Profile Photo"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Profile Actions & Quick Status */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                leftIcon={<Edit className="w-4 h-4" />}
                className="shadow-md"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSkillTypeToAdd('TEACH');
                  setIsAddSkillModalOpen(true);
                }}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Skill
              </Button>
            </div>
          </div>

          {/* User Bio & Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50">
                {profile?.name || user?.fullName || 'User Profile'}
              </h1>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-terracotta-500" />
              {user?.email || 'user@skillswap.com'}
            </p>
          </div>

          {/* Instagram Stats Row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <div className="text-center p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 backdrop-blur-xs">
              <span className="block text-xl font-bold text-slate-900 dark:text-slate-100">
                {teachSkills.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Teaching Skills
              </span>
            </div>

            <div className="text-center p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 backdrop-blur-xs">
              <span className="block text-xl font-bold text-slate-900 dark:text-slate-100">
                {learnSkills.length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Learning Skills
              </span>
            </div>

            <div className="text-center p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 backdrop-blur-xs">
              <span className="block text-xl font-bold text-emerald-600 dark:text-emerald-400">
                ★ 5.0
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Member Rating
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instagram Feed / Grid Style Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('teach')}
          className={`flex-1 py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'teach'
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Skills I Teach ({teachSkills.length})
        </button>

        <button
          onClick={() => setActiveTab('learn')}
          className={`flex-1 py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'learn'
              ? 'border-terracotta-500 text-terracotta-600 dark:text-terracotta-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4 text-terracotta-500" />
          Skills I Want to Learn ({learnSkills.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === 'settings'
              ? 'border-slate-800 text-slate-900 dark:border-slate-200 dark:text-slate-100'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <User className="w-4 h-4 text-slate-500" />
          Profile Details
        </button>
      </div>

      {/* TAB CONTENT 1: SKILLS TO TEACH */}
      {activeTab === 'teach' && (
        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                Skills You Can Teach
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Skills you offer to share with peers on SkillSwap.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSkillTypeToAdd('TEACH');
                setIsAddSkillModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Skill
            </Button>
          </div>

          {teachSkills.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Sparkles className="w-8 h-8 mx-auto text-emerald-400 mb-2 opacity-60" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                No teaching skills added yet.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-emerald-600 hover:text-emerald-700"
                onClick={() => {
                  setSkillTypeToAdd('TEACH');
                  setIsAddSkillModalOpen(true);
                }}
              >
                + Add your first teaching skill
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {teachSkills.map((item) => (
                <div
                  key={item.id}
                  className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 text-sm font-medium transition-all hover:pr-8"
                >
                  <span>{item.skill?.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(item.skill.id, item.skill.name)}
                    className="opacity-60 hover:opacity-100 p-0.5 hover:bg-emerald-200/60 dark:hover:bg-emerald-900 rounded-full transition-all"
                    title="Remove skill"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* TAB CONTENT 2: SKILLS TO LEARN */}
      {activeTab === 'learn' && (
        <Card glass className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-terracotta-500" />
                Skills You Want to Learn
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Skills you are eager to learn from community mentors.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSkillTypeToAdd('LEARN');
                setIsAddSkillModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Skill
            </Button>
          </div>

          {learnSkills.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <BookOpen className="w-8 h-8 mx-auto text-terracotta-400 mb-2 opacity-60" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                No learning skills added yet.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-terracotta-600 hover:text-terracotta-700"
                onClick={() => {
                  setSkillTypeToAdd('LEARN');
                  setIsAddSkillModalOpen(true);
                }}
              >
                + Add your first learning skill
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {learnSkills.map((item) => (
                <div
                  key={item.id}
                  className="group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta-50 dark:bg-terracotta-950/60 text-terracotta-700 dark:text-terracotta-300 border border-terracotta-200/80 dark:border-terracotta-800/80 text-sm font-medium transition-all"
                >
                  <span>{item.skill?.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(item.skill.id, item.skill.name)}
                    className="opacity-60 hover:opacity-100 p-0.5 hover:bg-terracotta-200/60 dark:hover:bg-terracotta-900 rounded-full transition-all"
                    title="Remove skill"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* TAB CONTENT 3: PROFILE SETTINGS */}
      {activeTab === 'settings' && (
        <Card glass className="p-6 space-y-6">
          <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-slate-500" />
            Profile Account & Database Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Profile ID (Profile Service)
              </span>
              <p className="font-mono text-slate-900 dark:text-slate-100 font-semibold">
                #{profile?.id}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                User ID (Auth Reference)
              </span>
              <p className="font-mono text-slate-900 dark:text-slate-100 font-semibold">
                #{profile?.userId}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Profile Created At
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Last Updated At
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Edit className="w-4 h-4" />}
            >
              Update Full Name & Info
            </Button>
          </div>
        </Card>
      )}

      {/* MODAL 1: EDIT PROFILE NAME */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100">
                Edit Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={updatingProfile}>
                  {updatingProfile ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD SKILL (TEACH OR LEARN) */}
      {isAddSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {skillTypeToAdd === 'TEACH' ? (
                  <>
                    <Sparkles className="w-5 h-5 text-emerald-500" /> Add Skill to Teach
                  </>
                ) : (
                  <>
                    <BookOpen className="w-5 h-5 text-terracotta-500" /> Add Skill to Learn
                  </>
                )}
              </h3>
              <button
                onClick={() => {
                  setIsAddSkillModalOpen(false);
                  setSearchQuery('');
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skill (e.g. React, Java, Design)..."
                  className="pl-9"
                  autoFocus
                />
              </div>

              {/* Search Results List */}
              <div className="max-h-56 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                {searching && (
                  <div className="text-center py-4 text-xs text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-terracotta-500" />
                    Searching skills database...
                  </div>
                )}

                {!searching && searchQuery.trim() && searchResults.length === 0 && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center space-y-2">
                    <p className="text-xs text-slate-500">
                      No matching skill found for "{searchQuery}".
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSelectSkillToAdd(searchQuery)}
                      disabled={addingSkill}
                    >
                      + Create & Add "{searchQuery}"
                    </Button>
                  </div>
                )}

                {searchResults.map((skillItem) => (
                  <div
                    key={skillItem.id}
                    onClick={() => handleSelectSkillToAdd(skillItem)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {skillItem.name}
                    </span>
                    <Plus className="w-4 h-4 text-terracotta-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsAddSkillModalOpen(false);
                  setSearchQuery('');
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
