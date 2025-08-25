import React, { useState, useEffect } from 'react';
import { Trash, Clock, Calendar, BookmarkCheck, ArrowRight, PencilLine, X, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogBottomContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { SmartCard } from '@/components/ui/smart-card';
import { useUI } from '@/contexts/UIContext';
import { ScheduleMetadata, getAllScheduleMetadataSorted, deleteSchedule } from '@/lib/utils/storage';
import { useScheduleManagement } from '@/hooks/useScheduleManagement';
import { useMobileDetection } from '@/hooks/useMobileDetection';
// import { RotationPattern } from '@/types/rotation';
import { formatDistanceToNow } from 'date-fns';

interface SavedSchedulesProps {
  onLoadSchedule: (scheduleId: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SavedSchedules({ onLoadSchedule, isOpen = false, onOpenChange }: SavedSchedulesProps) {
  const [savedSchedules, setSavedSchedules] = useState<ScheduleMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [localEditName, setLocalEditName] = useState<string>('');
  const { editingScheduleId, setEditingScheduleId, setErrorMessage } = useUI();
  const { renameSchedule } = useScheduleManagement({ onError: (e) => setErrorMessage(e) });
  const isMobileView = useMobileDetection();

  useEffect(() => {
    if (isOpen) {
      loadSavedSchedules();
    }
  }, [isOpen]);

  const loadSavedSchedules = () => {
    setIsLoading(true);
    const schedules = getAllScheduleMetadataSorted();
    setSavedSchedules(schedules);
    setIsLoading(false);
  };

  const openDeleteDialog = (e: React.MouseEvent, scheduleId: string) => {
    e.stopPropagation();
    setDeleteId(scheduleId);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    setRemovingId(id);
    window.setTimeout(() => {
      deleteSchedule(id);
      setRemovingId(null);
      loadSavedSchedules();
    }, 300);
  };

  const cancelDelete = () => setDeleteId(null);

  const startEdit = (e: React.MouseEvent, schedule: ScheduleMetadata) => {
    e.stopPropagation();
    setEditingScheduleId(schedule.id);
    setLocalEditName(schedule.name || `${schedule.rotationPattern} Schedule`);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingScheduleId(null);
    setLocalEditName('');
  };

  const confirmEdit = async (e: React.MouseEvent, scheduleId: string) => {
    e.stopPropagation();
    const name = localEditName.trim();
    if (!name) return;
    const res = renameSchedule(scheduleId, name);
    if (res.success) {
      setEditingScheduleId(null);
      setLocalEditName('');
      loadSavedSchedules();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const getScheduleStatus = (startDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 7) return 'upcoming';
    if (diffDays >= -30 && diffDays <= 7) return 'active';
    return 'completed';
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-slate-900 text-white border-slate-900',
      completed: 'bg-gray-100 text-gray-600 border-gray-200',
      upcoming: 'bg-orange-50 text-orange-800 border-orange-200'
    };
    
    const statusLabels = {
      active: 'Currently active schedule',
      completed: 'Completed schedule',
      upcoming: 'Upcoming schedule'
    };
    
    return (
      <span 
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]} ${
          isMobileView ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
        }`}
        aria-label={statusLabels[status as keyof typeof statusLabels]}
        role="status"
      >
        {status}
      </span>
    );
  };

  const getRotationColor = (rotationPattern: string) => {
    // Color coding similar to rotation pattern colors
    switch (rotationPattern) {
      case '14/14':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case '14/21':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case '28/28':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Custom':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const closeDialog = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
    setEditingScheduleId(null);
    setLocalEditName('');
    setDeleteId(null);
  };

  const DialogContentComponent = isMobileView ? DialogBottomContent : DialogContent;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange || (() => {})}>
        <DialogContentComponent 
          className={isMobileView 
            ? "p-0 max-h-[85vh] w-full max-w-none backdrop-blur-[8px] bg-white/95" 
            : "max-w-xl max-h-[85vh] p-0 backdrop-blur-xl bg-white/95 border border-white/30 flex flex-col"
          }
        >
          <div className="flex flex-col h-full max-h-[85vh]">
            {/* Header - Desktop only has bottom close button */}
            <DialogHeader className={`${isMobileView ? 'p-4 pb-3' : 'p-4 pb-3'} border-b border-gray-100 ${isMobileView ? 'backdrop-blur-[8px] bg-white/85' : 'backdrop-blur-xl bg-white/20'} flex-shrink-0`}>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <DialogTitle className={`font-semibold text-gray-900 flex items-center gap-2 ${
                    isMobileView ? 'text-lg justify-center' : 'text-lg justify-center'
                  }`}>
                    <BookmarkCheck className="w-5 h-5 text-orange-500" />
                    Saved Schedules
                    {savedSchedules.length > 0 && (
                      <span className="bg-orange-100 text-orange-800 text-sm px-2 py-0.5 rounded-full font-medium">
                        {savedSchedules.length}
                      </span>
                    )}
                  </DialogTitle>
                  <DialogDescription className={`text-gray-400 mt-1 ${
                    isMobileView ? 'text-xs' : 'text-sm'
                  }`}>
                    View, edit, and load your previously saved rotation schedules
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Scrollable Content Area */}
            <div className={`flex-1 min-h-0 overflow-y-auto ${isMobileView ? 'p-4' : 'p-3'}`}>
              {isLoading ? (
                <div className={`flex items-center justify-center ${isMobileView ? 'p-6' : 'p-8'}`} role="status" aria-live="polite">
                  <div className="animate-pulse text-gray-500 flex items-center gap-2">
                    <BookmarkCheck className="w-4 h-4" />
                    Loading saved schedules...
                  </div>
                </div>
              ) : savedSchedules.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center ${isMobileView ? 'p-6' : 'p-6'}">
                  <div className={`${isMobileView ? 'backdrop-blur-[8px] bg-white/85' : 'backdrop-blur-xl bg-white/30'} rounded-2xl p-8 border border-white/30`}>
                    <BookmarkCheck className={`mb-4 text-gray-300 mx-auto ${isMobileView ? 'w-12 h-12' : 'w-16 h-16'}`} />
                    <h3 className={`font-medium text-gray-700 mb-2 ${isMobileView ? 'text-base' : 'text-lg'}`}>
                      No Saved Schedules
                    </h3>
                    <p className={`text-gray-400 ${isMobileView ? 'text-xs' : 'text-sm'}`}>
                      Your schedules will appear here once you create and save them.
                    </p>
                  </div>
                </div>
              ) : (
                <div className={`space-y-2 ${isMobileView ? 'space-y-3' : 'space-y-2'} ${!isMobileView ? 'pb-2' : ''}`}>
                  {savedSchedules.map((schedule) => {
                    const status = getScheduleStatus(schedule.startDate);
                    const rotationColor = getRotationColor(schedule.rotationPattern);
                    
                    return (
                      <SmartCard
                        key={schedule.id}
                        variant="action-card"
                        context={isMobileView ? 'mobile' : 'desktop'}
                        interactionMode={isMobileView ? 'touch' : 'mouse'}
                        importance="secondary"
                        adaptiveContrast={true}
                        physicsEnabled={false}
                        magneticHover={false}
                        glassEffect={true}
                        phase2Enhanced={false}
                        microInteractions={true}
                        enhancedShadows={true}
                        gradientBackground={false}
                        borderEffects={false}
                        enhancedTypography={true}
                        visualIndicators={true}
                        ariaLabel={`Load schedule: ${schedule.name || schedule.rotationPattern + ' Schedule'}`}
                        ariaDescription={`${schedule.rotationPattern} rotation starting ${formatDate(schedule.startDate)}, last modified ${getTimeAgo(schedule.updatedAt)}`}
                        onClick={() => {
                          onLoadSchedule(schedule.id);
                          closeDialog();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onLoadSchedule(schedule.id);
                            closeDialog();
                          }
                        }}
                        className={`transition-all duration-200 card-container !py-3 ${
                          removingId === schedule.id ? 'opacity-0 scale-95' : 'opacity-100'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className={`flex items-center gap-2 ${isMobileView ? 'mb-2' : 'mb-2'}`}>
                              {editingScheduleId === schedule.id ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    value={localEditName}
                                    onChange={(ev) => setLocalEditName(ev.target.value)}
                                    onClick={(ev) => ev.stopPropagation()}
                                    className={`flex-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/80 ${
                                      isMobileView ? 'px-2 py-1.5 text-sm' : 'px-3 py-2'
                                    }`}
                                    aria-label="Edit schedule name"
                                  />
                                  <Button
                                    size={isMobileView ? "sm" : "sm"}
                                    disabled={!localEditName.trim()}
                                    onClick={(ev) => confirmEdit(ev, schedule.id)}
                                    aria-label="Confirm name change"
                                    className="min-w-[44px] min-h-[44px] bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className={isMobileView ? "w-3.5 h-3.5" : "w-4 h-4"} />
                                  </Button>
                                  <Button
                                    size={isMobileView ? "sm" : "sm"}
                                    variant="outline"
                                    onClick={cancelEdit}
                                    aria-label="Cancel name change"
                                    className="min-w-[44px] min-h-[44px]"
                                  >
                                    <X className={isMobileView ? "w-3.5 h-3.5" : "w-4 h-4"} />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <h3 className={`font-semibold text-gray-900 truncate ${
                                    isMobileView ? 'text-base' : 'text-base'
                                  }`}>
                                    {schedule.name || `${schedule.rotationPattern} Schedule`}
                                  </h3>
                                  {getStatusBadge(status)}
                                </>
                              )}
                            </div>
                            
                            <div className={`space-y-1 ${isMobileView ? 'mb-3' : 'mb-2'}`}>
                              <div className={`flex items-center text-gray-600 ${
                                isMobileView ? 'text-xs' : 'text-sm'
                              }`}>
                                <Calendar className={`mr-1.5 ${isMobileView ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'}`} />
                                <span>Starts: {formatDate(schedule.startDate)}</span>
                              </div>
                              
                              <div className={`flex items-center text-gray-600 ${
                                isMobileView ? 'text-xs' : 'text-sm'
                              }`}>
                                <Clock className={`mr-1.5 ${isMobileView ? 'w-3.5 h-3.5' : 'w-3.5 h-3.5'}`} />
                                <span>Modified: {getTimeAgo(schedule.updatedAt)}</span>
                              </div>
                            </div>
                            
                            <div className={`inline-flex items-center rounded-full border font-medium ${rotationColor} ${
                              isMobileView ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-xs'
                            }`}>
                              {schedule.rotationPattern} Rotation
                            </div>
                          </div>
                          
                          <div className={`flex items-center ml-1 ${isMobileView ? 'gap-2' : 'gap-1'}`}>
                            {editingScheduleId !== schedule.id && (
                              <button
                                onClick={(e) => startEdit(e, schedule)}
                                className={`text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${
                                  isMobileView ? 'p-3' : 'p-2'
                                }`}
                                aria-label={`Edit ${schedule.name || schedule.rotationPattern + ' schedule'}`}
                              >
                                <PencilLine className={isMobileView ? "w-4 h-4" : "w-4 h-4"} />
                              </button>
                            )}
                            <button
                              onClick={(e) => openDeleteDialog(e, schedule.id)}
                              className={`text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center ${
                                isMobileView ? 'p-3' : 'p-2'
                              }`}
                              aria-label={`Delete ${schedule.name || schedule.rotationPattern + ' schedule'}`}
                            >
                              <Trash className={isMobileView ? "w-4 h-4" : "w-4 h-4"} />
                            </button>
                            {!isMobileView && (
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </SmartCard>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer - Fixed at bottom */}
            <div className={`border-t border-gray-100 ${isMobileView ? 'p-4 backdrop-blur-[8px] bg-white/85' : 'p-3 backdrop-blur-xl bg-white/20'} flex-shrink-0`}>
              <Button 
                onClick={closeDialog}
                className={`w-full ${isMobileView ? 'min-h-[48px] text-base' : 'min-h-[44px]'}`}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContentComponent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className={isMobileView ? "max-w-sm mx-4 backdrop-blur-[8px] bg-white/95 border border-white/30" : "max-w-md backdrop-blur-xl bg-white/95 border border-white/30"}>
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${isMobileView ? "text-lg" : "text-base"}`}>
              <Trash className="w-5 h-5 text-red-500" />
              Delete schedule
            </DialogTitle>
            <DialogDescription className={isMobileView ? "text-sm text-gray-400" : "text-gray-400"}>
              This action cannot be undone. This will permanently delete the selected schedule.
            </DialogDescription>
          </DialogHeader>
          <div className={`flex gap-3 mt-4 ${isMobileView ? "flex-col" : ""}`}>
            <Button 
              variant="outline" 
              onClick={cancelDelete}
              className={isMobileView ? "w-full min-h-[44px]" : "flex-1"}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className={isMobileView ? "w-full min-h-[44px]" : "flex-1"}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}