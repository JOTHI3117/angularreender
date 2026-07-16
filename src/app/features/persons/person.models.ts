export interface Mentor {
  id: string;
  name: string;
  age: number;
  userName: string;
}

export interface Person {
  id?: string;
  personid?: number;
  name: string;
  qualification: string;
  mentor: Mentor | { id: string };
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
