// Thin wrapper around ActivityLog writes. Called from services after a
// mutation succeeds — never blocks or throws into the caller's flow,
// since losing an audit row should never fail the underlying action.
import { Prisma } from '@prisma/client';
import prisma from './prisma';

export const logActivity = async (params: {
  userId: string;
  action: string; // e.g. "DEPARTMENT_CREATE", "USER_ROLE_CHANGE"
  entityType: string; // e.g. "Department", "Category", "User"
  entityId?: string;
  metadata?: Record<string, unknown>;
}) => {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  } catch (err) {
    console.error('Failed to write activity log:', err);
  }
};
