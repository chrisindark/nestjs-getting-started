import { Controller } from '@nestjs/common';

import { GCloudPubsubRegistryService } from './gcloudPubsubRegistry.service';

@Controller({
  path: 'gcloud-pubsub-registry',
  version: ['1'],
})
export class GCloudPubSubRegistryController {
  constructor(
    private readonly gCloudPubsubRegistryService: GCloudPubsubRegistryService,
  ) {}
}
