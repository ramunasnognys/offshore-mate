import React, { useState, useEffect } from 'react';
import { Trash, Clock, Calendar, Info, ArrowRight } from 'lucide-react';
import { ScheduleMetadata, getAllScheduleMetadata, deleteSchedule } from '@/lib/utils/storage';
// import { RotationPattern } from '@/types/rotation';
import { formatDistanceToNow } from 'date-fns';

interface SavedSchedulesProps {
  onLoadSchedule: (scheduleId: string) => void;
  className?: string;
}

export function SavedSchedules({ onLoadSchedule, className = '' }: SavedSchedulesProps) {
  const [savedSchedules, setSavedSchedules] = useState<ScheduleMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved schedules when component mounts
    loadSavedSchedules();
  }, []);

  const loadSavedSchedules = () => {
    setIsLoading(true);
    // Load schedules from localStorage
    const schedules = getAllScheduleMetadata();
    setSavedSchedules(schedules);
    setIsLoading(false);
  };

  const handleDeleteSchedule = (e: React.MouseEvent, scheduleId: string) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteSchedule(scheduleId);
      loadSavedSchedules(); // Refresh the list
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
            className="backdrop-blur-xl bg-white/30 rounded-xl shadow-sm border border-white/30 
              transition-all duration-300 hover:shadow-md hover:bg-white/40 cursor-pointer group"
          >
            <div className="px-4 py-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800 group-hover:text-black transition-colors">
                    {schedule.name || `${schedule.rotationPattern} Schedule`}
                  </h4>
                  
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
                  <button 
                    onClick={(e) => handleDeleteSchedule(e, schedule.id)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors rounded-full hover:bg-white/50"
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
    </div>
  );
}