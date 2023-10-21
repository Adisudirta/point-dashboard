export type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

export type Role = "admin" | "member";

export type Member = {
  id: string;
  email: string;
  image?: string;
  displayName: string;
  currentPoint: number;
  achievedPoint: number;
};
