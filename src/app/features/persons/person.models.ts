export interface Person {
  id?: string;
  personid: number;
  name: string;
  qualification: string;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
