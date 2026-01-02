import React, { createContext, useReducer, useCallback, ReactNode } from 'react'
import { AppState, AppAction, Child, ScoreEvent } from '@/types'
import StorageService from '@/services/StorageService'
import ScoreManager from '@/services/ScoreManager'
import TemplateManager from '@/services/TemplateManager'

/**
 * 应用上下文
 */
export const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  addChild: (name: string, avatar: string) => Promise<void>
  updateChild: (child: Child) => Promise<void>
  deleteChild: (childId: string) => Promise<void>
  addScoreEvent: (
    childId: string,
    score: number,
    reason: string,
    categoryId: string,
  ) => Promise<void>
  loadState: () => Promise<void>
  saveState: () => Promise<void>
} | null>(null)

/**
 * 初始状态
 */
const initialState: AppState = {
  children: [],
  events: [],
  templates: [],
  isRecording: false,
  currentTranscription: '',
  currentView: 'dashboard',
}

/**
 * Reducer 函数
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_CHILD':
      return {
        ...state,
        children: [...state.children, action.payload],
      }

    case 'UPDATE_CHILD':
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.payload.id ? action.payload : child,
        ),
      }

    case 'DELETE_CHILD':
      return {
        ...state,
        children: state.children.filter((child) => child.id !== action.payload),
        events: state.events.filter((event) => event.childId !== action.payload),
      }

    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload],
        children: state.children.map((child) =>
          child.id === action.payload.childId
            ? { ...child, totalScore: child.totalScore + action.payload.scoreChange }
            : child,
        ),
      }

    case 'SET_RECORDING':
      return {
        ...state,
        isRecording: action.payload,
      }

    case 'SET_TRANSCRIPTION':
      return {
        ...state,
        currentTranscription: action.payload,
      }

    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload,
      }

    case 'LOAD_STATE':
      return action.payload

    case 'CLEAR_STATE':
      return initialState

    default:
      return state
  }
}

/**
 * AppContext Provider 组件
 */
export function AppProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialState)

  /**
   * 加载状态
   */
  const loadState = useCallback(async () => {
    try {
      const [loadedChildren, loadedEvents, loadedTemplates] = await Promise.all([
        StorageService.loadChildren(),
        StorageService.loadEvents(),
        StorageService.loadTemplates(),
      ])

      ScoreManager.initialize(loadedChildren, loadedEvents)
      TemplateManager.initialize(loadedTemplates)

      dispatch({
        type: 'LOAD_STATE',
        payload: {
          children: loadedChildren,
          events: loadedEvents,
          templates: loadedTemplates,
          isRecording: false,
          currentTranscription: '',
          currentView: 'dashboard',
        },
      })
    } catch (error) {
      console.error('加载状态失败:', error)
    }
  }, [])

  /**
   * 保存状态
   */
  const saveState = useCallback(async () => {
    try {
      await Promise.all([
        StorageService.saveChildren(state.children),
        StorageService.saveEvents(state.events),
        StorageService.saveTemplates(state.templates),
      ])
    } catch (error) {
      console.error('保存状态失败:', error)
    }
  }, [state])

  /**
   * 添加儿童
   */
  const addChild = useCallback(
    async (name: string, avatar: string) => {
      const newChild: Child = {
        id: `child-${Date.now()}`,
        name,
        avatar,
        totalScore: 0,
        createdAt: new Date(),
      }

      dispatch({ type: 'ADD_CHILD', payload: newChild })
      ScoreManager.updateChildren([...state.children, newChild])

      await StorageService.saveChildren([...state.children, newChild])
    },
    [state.children],
  )

  /**
   * 更新儿童
   */
  const updateChild = useCallback(
    async (child: Child) => {
      dispatch({ type: 'UPDATE_CHILD', payload: child })
      const updatedChildren = state.children.map((c: Child) => (c.id === child.id ? child : c))
      ScoreManager.updateChildren(updatedChildren)

      await StorageService.saveChildren(updatedChildren)
    },
    [state.children],
  )

  /**
   * 删除儿童
   */
  const deleteChild = useCallback(
    async (childId: string) => {
      dispatch({ type: 'DELETE_CHILD', payload: childId })
      const updatedChildren = state.children.filter((c: Child) => c.id !== childId)
      const updatedEvents = state.events.filter((e: ScoreEvent) => e.childId !== childId)

      ScoreManager.updateChildren(updatedChildren)
      ScoreManager.updateEvents(updatedEvents)

      await Promise.all([
        StorageService.saveChildren(updatedChildren),
        StorageService.saveEvents(updatedEvents),
      ])
    },
    [state.children, state.events],
  )

  /**
   * 添加积分事件
   */
  const addScoreEvent = useCallback(
    async (childId: string, score: number, reason: string, categoryId: string) => {
      const child = state.children.find((c: Child) => c.id === childId)
      if (!child) {
        throw new Error('儿童不存在')
      }

      // 获取分类信息
      const category = {
        id: categoryId,
        name: reason,
        color: score > 0 ? '#95E1D3' : '#FF6B6B',
        icon: score > 0 ? '✓' : '✗',
      }

      const event: ScoreEvent = {
        id: `event-${Date.now()}`,
        childId,
        childName: child.name,
        scoreChange: score,
        reason,
        category,
        timestamp: new Date(),
      }

      dispatch({ type: 'ADD_EVENT', payload: event })
      ScoreManager.updateEvents([...state.events, event])

      await StorageService.saveEvents([...state.events, event])
      await StorageService.saveChildren(
        state.children.map((c: Child) =>
          c.id === childId ? { ...c, totalScore: c.totalScore + score } : c,
        ),
      )
    },
    [state.children, state.events],
  )

  const value = {
    state,
    dispatch,
    addChild,
    updateChild,
    deleteChild,
    addScoreEvent,
    loadState,
    saveState,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

/**
 * 使用 AppContext 的 Hook
 */
export function useApp() {
  const context = React.useContext(AppContext)
  if (!context) {
    throw new Error('useApp 必须在 AppProvider 内使用')
  }
  return context
}
