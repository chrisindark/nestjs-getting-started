import { bootstrapHttpApp } from '@app/bootstrap';

import { WebsocketAppModule } from './apps/websocketApp/websocketApp.module';

void bootstrapHttpApp(WebsocketAppModule, { appName: 'websocket' });
