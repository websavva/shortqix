export abstract class Task {
  static run: () => Promise<void>;

  static cronExpression: string;

  static isSequential?: boolean;
}
