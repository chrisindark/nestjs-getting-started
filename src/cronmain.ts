import { bootstrapContextApp } from '@app/bootstrap';

import { CronAppModule } from './apps/cronApp/cronApp.module';

void bootstrapContextApp(CronAppModule, { appName: 'cron' });
