'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLevelForPoints } from '@/data/gamification';

interface GarageState {
  completedTasks: number[];
  subtaskChecks: Record<string, boolean>;
  taskInputs: Record<string, Record<string, string>>;
  currentWeek: number;
  streak: number;
  startupName: string;
  founderName: string;
  onboardingDone: boolean;
}

interface GarageContextType extends GarageState {
  points: number;
  completeTask: (num: number) => void;
  uncompleteTask: (num: number) => void;
  toggleSubtask: (key: string) => void;
  setTaskInput: (taskNum: number, field: string, value: string) => void;
  getTaskInput: (taskNum: number, field: string) => string;
  setStartupName: (name: string) => void;
  setFounderName: (name: string) => void;
  setOnboardingDone: (done: boolean) => void;
  getCurrentLevel: () => ReturnType<typeof getLevelForPoints>;
  activeMentorRole: string | null;
  setActiveMentorRole: (role: string | null) => void;
}

const defaultState: GarageState = {
  completedTasks: [],
  subtaskChecks: {},
  taskInputs: {},
  currentWeek: 1,
  streak: 3,
  startupName: 'My Startup',
  founderName: 'Founder',
  onboardingDone: false,
};

const GarageContext = createContext<GarageContextType | null>(null);

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GarageState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [activeMentorRole, setActiveMentorRole] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('garage-state');
    let parsed: Partial<GarageState> | null = null;
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch {}
    }
    setTimeout(() => {
      if (parsed) {
        setState({ ...defaultState, ...parsed });
      }
      setHydrated(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem('garage-state', JSON.stringify(state));
  }, [state, hydrated]);

  const points = state.completedTasks.length * 10;

  const completeTask = useCallback((num: number) => {
    setState(s => s.completedTasks.includes(num) ? s : { ...s, completedTasks: [...s.completedTasks, num] });
  }, []);

  const uncompleteTask = useCallback((num: number) => {
    setState(s => ({ ...s, completedTasks: s.completedTasks.filter(n => n !== num) }));
  }, []);

  const toggleSubtask = useCallback((key: string) => {
    setState(s => ({ ...s, subtaskChecks: { ...s.subtaskChecks, [key]: !s.subtaskChecks[key] } }));
  }, []);

  const setTaskInput = useCallback((taskNum: number, field: string, value: string) => {
    setState(s => ({
      ...s,
      taskInputs: {
        ...s.taskInputs,
        [taskNum]: { ...(s.taskInputs[taskNum] || {}), [field]: value }
      }
    }));
  }, []);

  const getTaskInput = useCallback((taskNum: number, field: string): string => {
    return state.taskInputs[taskNum]?.[field] || '';
  }, [state.taskInputs]);

  const setStartupName = useCallback((name: string) => setState(s => ({ ...s, startupName: name })), []);
  const setFounderName = useCallback((name: string) => setState(s => ({ ...s, founderName: name })), []);
  const setOnboardingDone = useCallback((done: boolean) => setState(s => ({ ...s, onboardingDone: done })), []);
  const getCurrentLevel = useCallback(() => getLevelForPoints(points), [points]);

  if (!hydrated) return null;

  return (
    <GarageContext.Provider value={{
      ...state, points, completeTask, uncompleteTask, toggleSubtask,
      setTaskInput, getTaskInput, setStartupName, setFounderName,
      setOnboardingDone, getCurrentLevel,
      activeMentorRole, setActiveMentorRole,
    }}>
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const ctx = useContext(GarageContext);
  if (!ctx) throw new Error('useGarage must be used within GarageProvider');
  return ctx;
}
