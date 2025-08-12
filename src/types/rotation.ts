export type RotationPattern = '14/14' | '14/21' | '28/28' | 'Custom';

export interface RotationConfig {
  workDays: number;
  offDays: number;
  label: string;
  value: RotationPattern;
  description: string;
}

export interface CustomRotation {
  workDays: number;
  offDays: number;
}

export interface CalendarDay {
  date: Date;
  isWorkDay: boolean;
  isInRotation: boolean;
  isTransitionDay: boolean;
}

export interface MonthData {
  month: string;
  year: number;
  days: CalendarDay[];
  firstDayOfWeek: number;
}