import { bootstrapHttpApp } from '@app/bootstrap';

import { AppModule } from './modules/app/app.module';

void bootstrapHttpApp(AppModule, { appName: 'api' });
