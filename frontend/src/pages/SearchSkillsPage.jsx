import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Eye, Send, Sparkles, RefreshCw, User } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { useToast } from '../contexts/ToastContext';
import { searchBrowseSkills, getFullPhotoUrl } from '../services/browseSkillApi';
import UserProfileModal from '../components/profile/UserProfileModal';

const SearchSkillsPage = () => {
  const [searchQuery, setSearchQuery] = useState('Java');
  const [debouncedQuery, setDebouncedQuery] = useState('Java');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 6;

  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [skillsData, setSkillsData] = useState({
    content: [],
    page: 0,
    size: pageSize,
    totalElements: 0,
    totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { showToast } = useToast();
  const searchInputRef = useRef(null);

  // Debounce search query input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setCurrentPage(0);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch search results from Browse Skill Service backend
  const fetchSearchResults = useCallback(async (query, page) => {
    if (!query) {
      setSkillsData({
        content: [],
        page: 0,
        size: pageSize,
        totalElements: 0,
        totalPages: 0,
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await searchBrowseSkills(query, page, pageSize);
      if (data) {
        setSkillsData(data);
      }
    } catch (err) {
      console.error('Error searching skills:', err);
      setError(err.message || 'Unable to connect to Browse Skill Service.');
      showToast({
        message: 'Could not fetch skill results. Check backend service status.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, showToast]);

  // Trigger search when debounced query or page changes
  useEffect(() => {
    fetchSearchResults(debouncedQuery, currentPage);
  }, [debouncedQuery, currentPage, fetchSearchResults]);

  // Handler for View Profile action - opens UserProfileModal
  const handleViewProfile = (teacherItem) => {
    setSelectedTeacher({
      userId: teacherItem.userId,
      name: teacherItem.name,
      skillName: teacherItem.skillName,
    });
  };

  // Handler for Send Swap Request action (Placeholder as instructed)
  const handleSendSwapRequest = (teacherName, skillName) => {
    showToast({
      message: `Swap Request feature coming soon in Module 5! (Requesting ${skillName} from ${teacherName})`,
      type: 'info',
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            Browse Skills Catalog
            <Sparkles className="w-6 h-6 text-terracotta-500 animate-pulse" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover peer teachers offering skills you want to learn and request a skill swap.
          </p>
        </div>

        {/* Total Results Counter */}
        {skillsData.totalElements > 0 && (
          <Badge variant="terracotta" size="lg" dot>
            {skillsData.totalElements} {skillsData.totalElements === 1 ? 'Teacher' : 'Teachers'} Found
          </Badge>
        )}
      </div>

      {/* Search Input & Quick Tags Card */}
      <Card glass className="p-6 space-y-4">
        <div className="relative">
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search by skill name (e.g. Java, React, Python)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5 text-slate-400" />}
            rightIcon={
              searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
                </button>
              ) : null
            }
            className="w-full text-base py-3"
          />
        </div>
      </Card>

      {/* Error Banner */}
      {error && (
        <Card className="p-6 border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-sm">Failed to connect to Browse Skill Service</p>
            <p className="text-xs opacity-90">{error}</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchSearchResults(debouncedQuery, currentPage)}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry
          </Button>
        </Card>
      )}

      {/* Loading Skeleton Grid */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <Card glass key={idx} className="p-6 space-y-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="flex gap-2 pt-2">
                <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1" />
                <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl flex-1" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty Search Results State */}
      {!isLoading && !error && skillsData.content.length === 0 && (
        <Card glass className="p-12 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-terracotta-500/10 text-terracotta-500 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {searchQuery ? `No teachers found for "${searchQuery}"` : 'Start searching for skills'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {searchQuery
                ? 'Try searching with a different skill name like Java, React, or Python.'
                : 'Type a skill name in the search box above to browse available peer teachers.'}
            </p>
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery('Java')}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Browse Java Teachers
            </Button>
          )}
        </Card>
      )}

      {/* Skill Teacher Cards Grid */}
      {!isLoading && !error && skillsData.content.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.content.map((item, index) => {
            const photoUrl = getFullPhotoUrl(item.profilePhoto);

            return (
              <Card
                key={`${item.userId}-${item.skillId}-${index}`}
                glass
                hover
                className="p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:border-terracotta-500/40"
              >
                {/* Header: Teacher Avatar & Info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={photoUrl}
                      name={item.name}
                      size="xl"
                      status="online"
                      className="border-2 border-terracotta-500/20"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate" title={item.name}>
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <User className="w-3.5 h-3.5 text-slate-400" /> Peer Educator
                      </p>
                      <div className="mt-2">
                        <Badge variant="terracotta" size="sm" dot>
                          TEACH: {item.skillName}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skill Details Overview */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">Offered Skill:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.skillName}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">Role:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Ready to Teach</span>
                  </div>
                </div>

                {/* Action Buttons: View Profile & Send Swap Request */}
                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs font-semibold"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => handleViewProfile(item)}
                  >
                    View Profile
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs font-semibold"
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                    onClick={() => handleSendSwapRequest(item.name, item.skillName)}
                  >
                    Send Swap Request
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && !error && skillsData.totalPages > 1 && (
        <Card glass className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Page <span className="font-bold text-slate-800 dark:text-slate-200">{skillsData.page + 1}</span> of{' '}
            <span className="font-bold text-slate-800 dark:text-slate-200">{skillsData.totalPages}</span> ({skillsData.totalElements} total results)
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            {/* Direct Page Numbers */}
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: skillsData.totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-7 h-7 text-xs font-semibold rounded-lg transition-colors ${
                    currentPage === i
                      ? 'bg-terracotta-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage >= skillsData.totalPages - 1}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, skillsData.totalPages - 1))}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </Card>
      )}

      {/* User Full Profile Details Modal */}
      <UserProfileModal
        isOpen={!!selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        userId={selectedTeacher?.userId}
        teacherName={selectedTeacher?.name}
        offeredSkillName={selectedTeacher?.skillName}
        onSendSwapRequest={handleSendSwapRequest}
      />
    </div>
  );
};

export default SearchSkillsPage;

