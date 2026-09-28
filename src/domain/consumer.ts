export type ConsumerId = string & {
  readonly __brand: "ConsumerId";
};

export type Consumer = {
  id: ConsumerId;
  name: string;
};

export type ConsumerRegistration = {
  consumer: Consumer;
  credential: string;
};