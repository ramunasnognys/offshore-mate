import React, { useState, useEffect } from 'react';
import { Trash, Clock, Calendar, Info, ArrowRight, PencilLine, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useUI } from '@/contexts/UIContext';
import { ScheduleMetadata, getAllScheduleMetadataSorted, deleteSchedule } from '@/lib/utils/storage';
import { useScheduleManagement } from '@/hooks/useScheduleManagement';
// import { RotationPattern } from '@/types/rotation';
import { formatDistanceToNow } from 'date-fns';

interface SavedSchedulesProps {
  onLoadSchedule: (scheduleId: string) => void;
  className?: string;
}

export function SavedSchedules({ onLoadSchedule, className = '' }: SavedSchedulesProps) {
  const [savedSchedules, setSavedSchedules] = useState<ScheduleMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [localEditName, setLocalEditName] = useState<string>('');
  const { editingScheduleId, setEditingScheduleId, setErrorMessage } = useUI();
  const { renameSchedule } = useScheduleManagement({ onError: (e) => setErrorMessage(e) });

  useEffect(() => {
    // Load saved schedules when component mounts
    loadSavedSchedules();
  }, []);

  const loadSavedSchedules = () => {
    setIsLoading(true);
    // Load schedules from localStorage
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
    // Animate collapse & fade before removing
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

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center p-8`}>
        <div className="animate-pulse">Loading saved schedules...</div>
      </div>
    );
  }

  if (savedSchedules.length === 0) {
    return (
      <div className={`${className} flex flex-col items-center justify-center p-8 text-center`}>
        <Info className="w-12 h-12 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Saved Schedules</h3>
        <p className="text-gray-500 text-sm">
          Your schedules will appear here once you create and save them.
        </p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-medium mb-4 text-gray-700">Your Saved Schedules</h3>
      
      <div className="space-y-3">
        {savedSchedules.map((schedule) => (
          <div 
            key={schedule.id}
            onClick={() => onLoadSchedule(schedule.id)}
            className={`backdrop-blur-xl bg-white/30 rounded-xl shadow-sm border border-white/30 
              transition-all duration-300 hover:shadow-md hover:bg-white/40 cursor-pointer group overflow-hidden ${
                removingId === schedule.id ? 'opacity-0 max-h-0' : 'opacity-100'
              }`}
          >
            <div className="px-4 py-3">
              <div className="flex justify-between items-start">
                <div>
                  {editingScheduleId === schedule.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={localEditName}
                        onChange={(ev) => setLocalEditName(ev.target.value)}
                        onClick={(ev) => ev.stopPropagation()}
                        className={`w-full px-3 py-1.5 rounded-md border bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          localEditName.trim() ? 'border-gray-300' : 'border-destructive'
                        }`}
                      />
                      <Button
                        size="sm"
                        variant="default"
                        disabled={!localEditName.trim()}
                        onClick={(ev) => confirmEdit(ev, schedule.id)}
                        aria-label="Confirm name"
                      >
                        <Check />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        aria-label="Cancel edit"
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <h4 className="font-medium text-gray-800 group-hover:text-black transition-colors truncate max-w-[240px]">
                      {schedule.name || `${schedule.rotationPattern} Schedule`}
                    </h4>
                  )}
                  
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1.5" />
                      <span>Starts: {formatDate(schedule.startDate)}</span>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1.5" />
                      <span>Modified: {getTimeAgo(schedule.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {editingScheduleId !== schedule.id && (
                    <button
                      onClick={(e) => startEdit(e, schedule)}
                      className="text-gray-400 hover:text-gray-700 p-1 transition-colors rounded-full hover:bg-white/50"
                      aria-label={`Edit ${schedule.name || schedule.rotationPattern + ' schedule'}`}
                    >
                      <PencilLine className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={(e) => openDeleteDialog(e, schedule.id)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors rounded-full hover:bg-white/50"
                    aria-label={`Delete ${schedule.name || schedule.rotationPattern + ' schedule'}`}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                  
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-all transform group-hover:translate-x-1" />
                </div>
              </div>
              
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {schedule.rotationPattern} Rotation
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete schedule</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">This action cannot be undone. This will permanently delete the selected schedule.</p>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}