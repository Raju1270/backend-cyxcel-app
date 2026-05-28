import type { VercelRequest, VercelResponse } from '@vercel/node';

import express, { type Express, type Request, type Response } from 'express';

import { createNestApp } from '../src/bootstrap/create-nest-app';

let cachedExpressApp: Express | null = null;

async function getServer(): Promise<Express> {
  if (cachedExpressApp) {
    return cachedExpressApp;
  }

  const expressApp = express();

  const nestApp = await createNestApp({
    expressApp,
  });

  await nestApp.init();

  cachedExpressApp = nestApp.getHttpAdapter().getInstance() as Express;

  return cachedExpressApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getServer();

  return app(req as unknown as Request, res as unknown as Response);
}
