// Single shared PrismaClient instance for the whole server.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
