export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface Task {
  id: string;
  title: string;
  totalQuestions: number;
  completedQuestions: number;
  completed: boolean;
  createdAt: number;
}

export interface AppSettings {
  focusTime: number; // in seconds
  shortBreakTime: number; // in seconds
  longBreakTime: number; // in seconds
  backgroundImage: string;
  dailyQuestionGoal: number;
  alarmEnabled: boolean;
  alarmSound: string;
}

export const ALARM_SOUNDS = {
  beep: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
  bell: 'https://actions.google.com/sounds/v1/alarms/mechanical_clock_ring.ogg',
  digital: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg',
  meditation: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
};

export const DEFAULT_SETTINGS: AppSettings = {
  focusTime: 25 * 60,
  shortBreakTime: 5 * 60,
  longBreakTime: 15 * 60,
  backgroundImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=2070',
  dailyQuestionGoal: 50,
  alarmEnabled: true,
  alarmSound: ALARM_SOUNDS.bell,
};