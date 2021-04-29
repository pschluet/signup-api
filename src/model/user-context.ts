import { PrismaClient } from '@prisma/client';
import express from 'express';
import { UserInfo } from './user-info';

export interface UserContext {
  req: express.Request;
  res: express.Response;
  prisma: PrismaClient;
  user: UserInfo;
}
