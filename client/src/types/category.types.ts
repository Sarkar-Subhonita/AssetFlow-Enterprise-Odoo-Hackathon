export interface AssetCategory {
  id: string;
  name: string;
  customFields: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    assets: number;
  };
}

export interface CreateCategoryPayload {
  name: string;
  customFields?: Record<string, unknown> | null;
}

export interface UpdateCategoryPayload {
  name?: string;
  customFields?: Record<string, unknown> | null;
}
