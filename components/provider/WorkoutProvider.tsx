import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

const WorkoutContext = createContext<any>(null);

const todayKeyFromDate = (d: Date) => {
  const dayIndex = d.getDay();
  const map = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ] as const;
  return map[dayIndex];
};

const isoToday = () => new Date().toISOString().slice(0, 10);

const daysBetween = (a: string, b: string) => {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
};

const defaultSplit = {
  monday: {
    id: "monday",
    name: "Back & Biceps",
    exercises: [
      {
        id: "lat-pulldown",
        name: "Lat Pulldown",
        weight: 45,
        reps: 12,
        suggestedIncrease: 5,
        lastOverloadDate: null as string | null,
      },
      {
        id: "barbell-row",
        name: "Barbell Row",
        weight: 50,
        reps: 10,
        suggestedIncrease: 5,
        lastOverloadDate: null as string | null,
      },
    ],
  },
  tuesday: {
    id: "tuesday",
    name: "Chest & Triceps",
    exercises: [
      {
        id: "bench-press",
        name: "Bench Press",
        weight: 60,
        reps: 8,
        suggestedIncrease: 2.5,
        lastOverloadDate: null as string | null,
      },
      {
        id: "incline-dumbbell",
        name: "Incline Dumbbell Press",
        weight: 22.5,
        reps: 10,
        suggestedIncrease: 2.5,
        lastOverloadDate: null as string | null,
      },
    ],
  },
  wednesday: {
    id: "wednesday",
    name: "Legs",
    exercises: [
      {
        id: "squat",
        name: "Back Squat",
        weight: 70,
        reps: 8,
        suggestedIncrease: 5,
        lastOverloadDate: null as string | null,
      },
      {
        id: "leg-press",
        name: "Leg Press",
        weight: 100,
        reps: 12,
        suggestedIncrease: 10,
        lastOverloadDate: null as string | null,
      },
    ],
  },
  thursday: {
    id: "thursday",
    name: "Shoulders",
    exercises: [
      {
        id: "ohp",
        name: "Overhead Press",
        weight: 35,
        reps: 8,
        suggestedIncrease: 2.5,
        lastOverloadDate: null as string | null,
      },
    ],
  },
  friday: {
    id: "friday",
    name: "Arms",
    exercises: [
      {
        id: "ez-curl",
        name: "EZ Bar Curl",
        weight: 25,
        reps: 12,
        suggestedIncrease: 2.5,
        lastOverloadDate: null as string | null,
      },
    ],
  },
};

export function WorkoutProvider({ children }) {
  const [split, setSplit] = useState<any>(defaultSplit);

  const [todayState, setTodayState] = useState({
    date: isoToday(),
    completedExerciseIds: [] as string[],
  });

  const todayKey = todayKeyFromDate(new Date());
  const todayWorkout = split[todayKey] || null;

  useEffect(() => {
    const today = isoToday();
    if (todayState.date !== today) {
      setTodayState({ date: today, completedExerciseIds: [] });
    }
  }, [todayState.date]);

  const progress = useMemo(() => {
    if (!todayWorkout) return { completed: 0, total: 0, ratio: 0 };
    const total = todayWorkout.exercises.length;
    const completed = todayWorkout.exercises.filter((ex: any) =>
      todayState.completedExerciseIds.includes(ex.id)
    ).length;
    const ratio = total === 0 ? 0 : completed / total;
    return { completed, total, ratio };
  }, [todayWorkout, todayState.completedExerciseIds]);

  const finishExercise = (exerciseId: string) => {
    const today = isoToday();
    setTodayState((prev) => {
      if (prev.date !== today) {
        return { date: today, completedExerciseIds: [exerciseId] };
      }
      if (prev.completedExerciseIds.includes(exerciseId)) return prev;
      return {
        ...prev,
        completedExerciseIds: [...prev.completedExerciseIds, exerciseId],
      };
    });
  };

  const applyOverload = (dayKey: string, exerciseId: string) => {
    const today = isoToday();
    setSplit((prev: any) => {
      const day = prev[dayKey];
      if (!day) return prev;
      const updatedExercises = day.exercises.map((ex: any) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          weight: ex.weight + ex.suggestedIncrease,
          lastOverloadDate: today,
        };
      });
      return {
        ...prev,
        [dayKey]: {
          ...day,
          exercises: updatedExercises,
        },
      };
    });
  };

  const canOverload = (dayKey: string, ex: any) => {
    if (!ex.lastOverloadDate) return true;
    const diff = daysBetween(ex.lastOverloadDate, isoToday());
    return diff >= 7;
  };

  const nextDayKey = () => {
    const order = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const idx = order.indexOf(todayKey);
    const next = order[(idx + 1) % order.length];
    return next;
  };

  const tomorrowWorkout = split[nextDayKey()] || null;

  return (
    <WorkoutContext.Provider
      value={{
        split,
        setSplit,
        todayKey,
        todayWorkout,
        todayState,
        progress,
        finishExercise,
        applyOverload,
        canOverload,
        tomorrowWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  return useContext(WorkoutContext);
}
