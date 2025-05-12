/**
 * Local Storage utility functions for Offshore Mate
 * Implements functionality to save, load, and manage rotation schedules in browser localStorage
 */

// Constants for storage
export const STORAGE_KEYS = {
  SCHEDULES_INDEX: 'offshore_mate_schedules',
  SCHEDULE_PREFIX: 'offshore_mate_schedule_',
  SCHEMA_VERSION: 'v1', // For future migrations
};

// Check if localStorage is available in the browser
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error('localStorage is not available:', e);
    return false;
  }
};

// Schedule metadata interface
export interface ScheduleMetadata {
  id: string;
  name: string;
  rotationPattern: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
  schemaVersion: string;
}

// Full schedule data interface
export interface SavedSchedule {
  metadata: ScheduleMetadata;
  calendar: any[]; // Using any for now, will be replaced with MonthData[] from rotation types
}

// Get all saved schedule IDs
export const getSavedScheduleIds = (): string[] => {
  if (!isStorageAvailable()) return [];
  
  try {
    const schedulesJson = localStorage.getItem(STORAGE_KEYS.SCHEDULES_INDEX);
    if (!schedulesJson) return [];
    
    return JSON.parse(schedulesJson);
  } catch (e) {
    console.error('Error retrieving saved schedule IDs:', e);
    return [];
  }
};

// Add a schedule ID to the index
export const addScheduleToIndex = (id: string): void => {
  if (!isStorageAvailable()) return;
  
  try {
    const scheduleIds = getSavedScheduleIds();
    if (!scheduleIds.includes(id)) {
      scheduleIds.push(id);
      localStorage.setItem(STORAGE_KEYS.SCHEDULES_INDEX, JSON.stringify(scheduleIds));
    }
  } catch (e) {
    console.error('Error adding schedule to index:', e);
  }
};

// Remove a schedule ID from the index
export const removeScheduleFromIndex = (id: string): void => {
  if (!isStorageAvailable()) return;
  
  try {
    const scheduleIds = getSavedScheduleIds();
    const updatedIds = scheduleIds.filter(scheduleId => scheduleId !== id);
    localStorage.setItem(STORAGE_KEYS.SCHEDULES_INDEX, JSON.stringify(updatedIds));
  } catch (e) {
    console.error('Error removing schedule from index:', e);
  }
};

// Generate a unique ID for a new schedule
export const generateScheduleId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
};

// Save a schedule to localStorage
export const saveSchedule = (schedule: SavedSchedule): boolean => {
  if (!isStorageAvailable()) return false;
  
  try {
    // Ensure the schedule has an ID
    if (!schedule.metadata.id) {
      schedule.metadata.id = generateScheduleId();
    }
    
    // Update timestamps
    schedule.metadata.updatedAt = new Date().toISOString();
    if (!schedule.metadata.createdAt) {
      schedule.metadata.createdAt = schedule.metadata.updatedAt;
    }
    
    // Set schema version
    schedule.metadata.schemaVersion = STORAGE_KEYS.SCHEMA_VERSION;
    
    // Save the schedule
    const key = `${STORAGE_KEYS.SCHEDULE_PREFIX}${schedule.metadata.id}`;
    localStorage.setItem(key, JSON.stringify(schedule));
    
    // Add to the index
    addScheduleToIndex(schedule.metadata.id);
    
    return true;
  } catch (e) {
    console.error('Error saving schedule:', e);
    return false;
  }
};

// Get a schedule by ID
export const getSchedule = (id: string): SavedSchedule | null => {
  if (!isStorageAvailable()) return null;
  
  try {
    const key = `${STORAGE_KEYS.SCHEDULE_PREFIX}${id}`;
    const scheduleJson = localStorage.getItem(key);
    if (!scheduleJson) return null;
    
    return JSON.parse(scheduleJson);
  } catch (e) {
    console.error(`Error getting schedule with ID ${id}:`, e);
    return null;
  }
};

// Get all saved schedules
export const getAllSchedules = (): SavedSchedule[] => {
  if (!isStorageAvailable()) return [];
  
  try {
    const scheduleIds = getSavedScheduleIds();
    return scheduleIds
      .map(id => getSchedule(id))
      .filter((schedule): schedule is SavedSchedule => schedule !== null);
  } catch (e) {
    console.error('Error getting all schedules:', e);
    return [];
  }
};

// Get all schedule metadata (without full calendar data)
export const getAllScheduleMetadata = (): ScheduleMetadata[] => {
  if (!isStorageAvailable()) return [];
  
  try {
    return getAllSchedules().map(schedule => schedule.metadata);
  } catch (e) {
    console.error('Error getting schedule metadata:', e);
    return [];
  }
};

// Delete a schedule
export const deleteSchedule = (id: string): boolean => {
  if (!isStorageAvailable()) return false;
  
  try {
    const key = `${STORAGE_KEYS.SCHEDULE_PREFIX}${id}`;
    localStorage.removeItem(key);
    removeScheduleFromIndex(id);
    return true;
  } catch (e) {
    console.error(`Error deleting schedule with ID ${id}:`, e);
    return false;
  }
};

// Delete all schedules
export const deleteAllSchedules = (): boolean => {
  if (!isStorageAvailable()) return false;
  
  try {
    const scheduleIds = getSavedScheduleIds();
    scheduleIds.forEach(id => {
      const key = `${STORAGE_KEYS.SCHEDULE_PREFIX}${id}`;
      localStorage.removeItem(key);
    });
    localStorage.removeItem(STORAGE_KEYS.SCHEDULES_INDEX);
    return true;
  } catch (e) {
    console.error('Error deleting all schedules:', e);
    return false;
  }
};
