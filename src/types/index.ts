/**
 * 儿童数据模型
 * 需求: 3.1, 3.2
 */
export interface Child {
  id: string;
  name: string;
  avatar: string;
  totalScore: number;
  createdAt: Date;
}

/**
 * 事件分类
 * 需求: 6.1, 6.2
 */
export interface EventCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

/**
 * 积分事件
 * 需求: 5.1, 2.5
 */
export interface ScoreEvent {
  id: string;
  childId: string;
  childName: string;
  scoreChange: number;
  reason: string;
  category: EventCategory;
  timestamp: Date;
  voiceText?: string;
}

/**
 * 模板事件
 * 需求: 6.1, 6.2
 */
export interface TemplateEvent {
  description: string;
  scoreValue: number;
  isPositive: boolean;
}

/**
 * 模板
 * 需求: 6.1, 6.2, 6.3
 */
export interface Template {
  id: string;
  name: string;
  category: 'family' | 'school' | 'life' | 'study';
  events: TemplateEvent[];
}

/**
 * 时间范围
 * 需求: 4.2, 4.3, 4.4
 */
export interface TimeRange {
  start: Date;
  end: Date;
}

/**
 * 月度统计
 * 需求: 4.2, 4.3
 */
export interface MonthlyStats {
  totalEvents: number;
  positiveEvents: number;
  negativeEvents: number;
  netScore: number;
  categoryBreakdown: Record<string, number>;
}

/**
 * 语音解析结果
 * 需求: 2.1, 2.2, 2.3
 */
export interface ParseResult {
  childName?: string;
  childId?: string;
  scoreChange?: number;
  reason?: string;
  confidence: number;
  suggestions?: string[];
}

/**
 * 应用状态
 */
export interface AppState {
  children: Child[];
  events: ScoreEvent[];
  templates: Template[];
  isRecording: boolean;
  currentTranscription: string;
  selectedChild?: Child;
  currentView: 'dashboard' | 'children' | 'statistics' | 'templates';
}

/**
 * 应用 Action 类型
 */
export type AppAction =
  | { type: 'ADD_CHILD'; payload: Child }
  | { type: 'UPDATE_CHILD'; payload: Child }
  | { type: 'DELETE_CHILD'; payload: string }
  | { type: 'ADD_EVENT'; payload: ScoreEvent }
  | { type: 'SET_RECORDING'; payload: boolean }
  | { type: 'SET_TRANSCRIPTION'; payload: string }
  | { type: 'SET_VIEW'; payload: AppState['currentView'] }
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'CLEAR_STATE' };
