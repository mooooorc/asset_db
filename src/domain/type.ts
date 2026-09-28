export type TypeId = string & {
  readonly __brand: "TypeId";
};

export type BaseType = "string" | "number" | "boolean";

export type Type = {
  id: TypeId;
  name: string;
  baseType: BaseType;
  default?: string | number | boolean;
};