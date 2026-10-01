export type UserId = string & {
  readonly __brand: "UserId";
};

export type UserRole =
  | "Manager"
  | "Viewer";

export type NewUser = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  id: UserId;
  name: string;
  email: string;
  role: UserRole;
};