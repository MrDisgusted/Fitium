const carb = 4;
const protien = 4;
const fat = 9;

export const dailyCaloriesCalculation = (data) => {
    const bmr = data.gender === "male" 
        ? 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
        : 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;

    const calc = bmr * data.activity;
    return Math.round(calc);
};

export const caloriesFromMacros = ({ carbs, protein, fats }) => {
  return carbs * 4 + protein * 4 + fats * 9;
};