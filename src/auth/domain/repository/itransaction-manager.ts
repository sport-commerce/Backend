export interface ITransactionManager {
  transaction<T>(callback: () => Promise<T>): Promise<T>;
}