import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly isProduction: boolean;

  constructor(configService: ConfigService) {
    const databaseUrl = configService.get<string>('database.url');
    const isProduction = configService.get<string>('app.env') === 'production';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(
      databaseUrl ? { datasources: { db: { url: databaseUrl } } } : undefined,
    );
    this.isProduction = isProduction;
  }

  async onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    try {
      await this.$connect();
    } catch (error) {
      if (this.isProduction) {
        throw error;
      }

      console.warn(
        'Prisma failed to connect during startup; continuing in development mode.',
        error,
      );
    }
  }

  async onModuleDestroy() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.$disconnect();
  }
}
