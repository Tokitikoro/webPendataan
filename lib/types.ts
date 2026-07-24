export type MonthValue = { target: number; realization: number };
export type Survey = {
  id: string;
  category: string;
  name: string;
  period: string;
  owner: string;
  months: MonthValue[];
};
