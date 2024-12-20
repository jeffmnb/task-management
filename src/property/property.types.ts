export type Property = {
  id: string;
  name: string;
  year: number;
  status: PropertyStatus;
};

export enum PropertyStatus {
  NEW = 'NEW',
  OLD = 'OLD',
}
