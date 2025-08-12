import React, { useState, useEffect } from 'react';
import { Trash, Clock, Calendar, Info, ArrowRight, PencilLine, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogBottomContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
      active: 'bg-slate-900 text-white',
      completed: 'bg-slate-200 text-slate-700',
      upcoming: 'bg-slate-100 text-slate-600'
    };
    
    const statusLabels = {
      active: 'Currently active schedule',
      completed: 'Completed schedule',
      upcoming: 'Upcoming schedule'
    };
    
    return (
      <span 
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]} ${
          isMobileView ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-0.5 text-xs'
        }`}
        aria-label={statusLabels[status as keyof typeof statusLabels]}
        role="status"
      >
        {status}
      </span>
    );
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
            ? "p-0 max-h-[85vh] w-full max-w-none" 
            : "max-w-2xl max-h-[80vh] p-0"
          }
        >
          <div className="flex flex-col h-full">
            <DialogHeader className={`${isMobileView ? 'p-4 pb-3' : 'p-6 pb-4'} border-b border-gray-100`}>
              <div className={`flex items-center ${isMobileView ? 'justify-center' : 'justify-between'}`}>
                <div className={isMobileView ? 'text-center' : ''}>
                  <DialogTitle className={`font-semibold text-gray-900 ${
                    isMobileView ? 'text-lg' : 'text-xl'
                  }`}>
                    Saved Schedules
                  </DialogTitle>
                  <DialogDescription className={`text-gray-500 mt-1 ${
                    isMobileView ? 'text-xs' : 'text-sm'
                  }`}>
                    View, edit, and load your previously saved rotation schedules
                  </DialogDescription>
                </div>
                {!isMobileView && (
                  <button
                    onClick={closeDialog}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            </DialogHeader>

            <div className={`flex-1 overflow-y-auto ${isMobileView ? 'p-4' : 'p-6'}`}>
              {isLoading ? (
                <div className={`flex items-center justify-center ${isMobileView ? 'p-6' : 'p-8'}`} role="status" aria-live="polite">
                  <div className="animate-pulse text-gray-500">Loading saved schedules...</div>
                </div>
              ) : savedSchedules.length === 0 ? (
                <div className={`flex flex-col items-center justify-center text-center ${isMobileView ? 'p-6' : 'p-8'}`}>
                  <Info className={`mb-4 text-gray-300 ${isMobileView ? 'w-10 h-10' : 'w-12 h-12'}`} />
                  <h3 className={`font-medium text-gray-700 mb-2 ${isMobileView ? 'text-base' : 'text-lg'}`}>
                    No Saved Schedules
                  </h3>
                  <p className={`text-gray-500 ${isMobileView ? 'text-xs' : 'text-sm'}`}>
                    Your schedules will appear here once you create and save them.
                  </p>
                </div>
              ) : (
                <div className={`space-y-3 ${isMobileView ? 'space-y-3' : 'space-y-4'}`}>
                  {savedSchedules.map((schedule) => {
                    const status = getScheduleStatus(schedule.startDate);
                    return (
                      <div
                        key={schedule.id}
                        onClick={() => {
                          onLoadSchedule(schedule.id);
                          closeDialog();
                        }}
                        className={`bg-white rounded-2xl border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300 ${
                          removingId === schedule.id ? 'opacity-0 scale-95' : 'opacity-100'
                        } ${isMobileView ? 'p-4' : 'p-6'}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onLoadSchedule(schedule.id);
                            closeDialog();
                          }
                        }}
                        aria-label={`Load schedule: ${schedule.name || schedule.rotationPattern + ' Schedule'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className={`flex items-center gap-2 ${isMobileView ? 'mb-2' : 'mb-3'}`}>
                              {editingScheduleId === schedule.id ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    value={localEditName}
                                    onChange={(ev) => setLocalEditName(ev.target.value)}
                                    onClick={(ev) => ev.stopPropagation()}
                                    className={`flex-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                      isMobileView ? 'px-2 py-1.5 text-sm' : 'px-3 py-2'
                                    }`}
                                    aria-label="Edit schedule name"
                                  />
                                  <Button
                                    size={isMobileView ? "sm" : "sm"}
                                    disabled={!localEditName.trim()}
                                    onClick={(ev) => confirmEdit(ev, schedule.id)}
                                    aria-label="Confirm name change"
                                    className="min-w-[44px] min-h-[44px]"
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
                                    isMobileView ? 'text-base' : 'text-lg'
                                  }`}>
                                    {schedule.name || `${schedule.rotationPattern} Schedule`}
                                  </h3>
                                  {getStatusBadge(status)}
                                </>
                              )}
                            </div>
                            
                            <div className={`space-y-1.5 ${isMobileView ? 'mb-3' : 'mb-4'}`}>
                              <div className={`flex items-center text-gray-600 ${
                                isMobileView ? 'text-xs' : 'text-sm'
                              }`}>
                                <Calendar className={`mr-1.5 ${isMobileView ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                                <span>Starts: {formatDate(schedule.startDate)}</span>
                              </div>
                              
                              <div className={`flex items-center text-gray-600 ${
                                isMobileView ? 'text-xs' : 'text-sm'
                              }`}>
                                <Clock className={`mr-1.5 ${isMobileView ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                                <span>Modified: {getTimeAgo(schedule.updatedAt)}</span>
                              </div>
                            </div>
                            
                            <div className={`inline-flex items-center rounded-full bg-gray-100 text-gray-700 font-medium ${
                              isMobileView ? 'px-2.5 py-1 text-xs' : 'px-3 py-1 text-sm'
                            }`}>
                              {schedule.rotationPattern} Rotation
                            </div>
                          </div>
                          
                          <div className={`flex items-center ml-3 ${isMobileView ? 'gap-2' : 'gap-2'}`}>
                            {editingScheduleId !== schedule.id && (
                              <button
                                onClick={(e) => startEdit(e, schedule)}
                                className={`text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                                  isMobileView ? 'p-3' : 'p-2'
                                }`}
                                aria-label={`Edit ${schedule.name || schedule.rotationPattern + ' schedule'}`}
                              >
                                <PencilLine className={isMobileView ? "w-4 h-4" : "w-5 h-5"} />
                              </button>
                            )}
                            <button
                              onClick={(e) => openDeleteDialog(e, schedule.id)}
                              className={`text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${
                                isMobileView ? 'p-3' : 'p-2'
                              }`}
                              aria-label={`Delete ${schedule.name || schedule.rotationPattern + ' schedule'}`}
                            >
                              <Trash className={isMobileView ? "w-4 h-4" : "w-5 h-5"} />
                            </button>
                            {!isMobileView && (
                              <ArrowRight className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={`border-t border-gray-100 ${isMobileView ? 'p-4' : 'p-6'}`}>
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
        <DialogContent className={isMobileView ? "max-w-sm mx-4" : ""}>
          <DialogHeader>
            <DialogTitle className={isMobileView ? "text-lg" : ""}>Delete schedule</DialogTitle>
            <DialogDescription className={isMobileView ? "text-sm" : ""}>
              This action cannot be undone. This will permanently delete the selected schedule.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={isMobileView ? "gap-2 sm:gap-2" : ""}>
            <Button 
              variant="outline" 
              onClick={cancelDelete}
              className={isMobileView ? "min-h-[44px] w-full" : ""}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className={isMobileView ? "min-h-[44px] w-full" : ""}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}