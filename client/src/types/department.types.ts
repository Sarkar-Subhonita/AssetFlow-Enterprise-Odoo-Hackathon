export type DepartmentStatus = 'ACTIVE' | 'INACTIVE';

export interface DepartmentRef {
  id: string;
  name: string;
}

export interface DepartmentHead {
  id: string;
  name: string;
  email: string;
}

export interface Department {
  id: string;
  name: string;
  status: DepartmentStatus;
  headUserId: string | null;
  head: DepartmentHead | null;
  parentDepartmentId: string | null;
  parent: DepartmentRef | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    members: number;
    children: number;
    currentAssets: number;
  };
}

export interface CreateDepartmentPayload {
  name: string;
  headUserId?: string | null;
  parentDepartmentId?: string | null;
}

export interface UpdateDepartmentPayload {
  name?: string;
  headUserId?: string | null;
  parentDepartmentId?: string | null;
  status?: DepartmentStatus;
}
