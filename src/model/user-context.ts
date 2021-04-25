import { PrismaClient } from '@prisma/client';
import express from 'express';

export interface UserContext {
  req: express.Request
  res: express.Response,
  prisma: PrismaClient
}