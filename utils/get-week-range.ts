import { endOfWeek, isValid, setWeek, startOfWeek } from "date-fns";

export const getWeekRange = (week: number, year: number) => {
  if (!Number.isInteger(week) || week < 1 || week > 53) {
    throw new Error("Week number must be an integer between 1 and 53");
  }

  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error("Year must be a positive integer between 1900 and 2100");
  }

  const date = setWeek(new Date(year, 0, 1), week, {
    weekStartsOn: 1, // Monday
    firstWeekContainsDate: 4, // ISO week numbering
  });

  const startDate = startOfWeek(date, { weekStartsOn: 1 });
  const endDate = endOfWeek(date, { weekStartsOn: 1 });

  if (!isValid(startDate) || !isValid(endDate)) {
    throw new Error(
      "Invalid date generated for the given week number and year"
    );
  }

  return { startDate, endDate };
};
