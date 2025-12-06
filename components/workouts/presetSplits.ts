export const presetSplits = {
  ppl: {
    name: "Push / Pull / Legs",
    schedule: {
      monday: {
        name: "Push",
        exercises: [
          { id: "bench", name: "Bench Press", weight: 60, reps: 8, suggestedIncrease: 2.5, lastOverloadDate: null },
          { id: "ohp", name: "Overhead Press", weight: 35, reps: 8, suggestedIncrease: 2.5, lastOverloadDate: null },
        ],
      },
      tuesday: {
        name: "Pull",
        exercises: [
          { id: "row", name: "Barbell Row", weight: 50, reps: 10, suggestedIncrease: 5, lastOverloadDate: null },
          { id: "pulldown", name: "Lat Pulldown", weight: 45, reps: 12, suggestedIncrease: 5, lastOverloadDate: null },
        ],
      },
      wednesday: {
        name: "Legs",
        exercises: [
          { id: "squat", name: "Back Squat", weight: 70, reps: 8, suggestedIncrease: 5, lastOverloadDate: null },
          { id: "legpress", name: "Leg Press", weight: 100, reps: 12, suggestedIncrease: 10, lastOverloadDate: null },
        ],
      },
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    },
  },

  bro: {
    name: "Bro Split",
    schedule: {
      monday: { name: "Chest", exercises: [] },
      tuesday: { name: "Back", exercises: [] },
      wednesday: { name: "Shoulders", exercises: [] },
      thursday: { name: "Arms", exercises: [] },
      friday: { name: "Legs", exercises: [] },
      saturday: null,
      sunday: null,
    },
  },

  upperLower: {
    name: "Upper / Lower",
    schedule: {
      monday: { name: "Upper", exercises: [] },
      tuesday: { name: "Lower", exercises: [] },
      wednesday: null,
      thursday: { name: "Upper", exercises: [] },
      friday: { name: "Lower", exercises: [] },
      saturday: null,
      sunday: null,
    },
  },
};
