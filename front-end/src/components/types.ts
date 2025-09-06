export type Role = "Student" | "Tutor" | "Vice_Dean";

export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role: Role;
  studentId?: number;
}