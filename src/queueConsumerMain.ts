import { bootstrapContextApp } from '@app/bootstrap';

import { QueueConsumerAppModule } from './apps/queueConsumerApp/queueConsumerApp.module';

void bootstrapContextApp(QueueConsumerAppModule, { appName: 'queue-consumer' });
