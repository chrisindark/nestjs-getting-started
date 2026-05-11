import { bootstrapContextApp } from '@app/bootstrap';

import { ClAppModule } from './apps/clApp/clApp.module';

void bootstrapContextApp(ClAppModule, { appName: 'cli', runOnce: true });
