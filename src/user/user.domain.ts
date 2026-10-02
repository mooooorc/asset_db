export type UserId = string & {
  readonly __brand: "UserId";
};

export type UserRole =
  | "Viewer"
  | "Admin"
  | "Builder";

export type NewUser = {
  name: string;
  email: string;
  password: string;
  roles: UserRole[];
};

export type User = {
  id: UserId;
  name: string;
  email: string;
  roles: UserRole[];
};