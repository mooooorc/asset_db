import type { PackageId } from "../package/package.domain.js";

export type ConsumerId = string & {
  readonly __brand: "ConsumerId";
};

export type Consumer = {
  id: ConsumerId;
  name: string;
  packages: PackageId[];
};

export type ConsumerRegistration = {
  consumer: Consumer;
  credential: string;
};

