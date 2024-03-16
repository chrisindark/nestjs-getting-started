import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwilioAccountStatus } from './twilio.enum';

import * as Twilio from 'twilio';
import { TWILIO_ACCOUNT_LIST_API_LIMIT } from './twilio.constant';

@Injectable()
export class TwilioService implements OnApplicationShutdown {
  private client;
  private readonly accountSid;
  private readonly accountToken;
  private readonly voiceToolsTwilioApiKey;
  private readonly voiceToolsTwilioSecretKey;
  private readonly outgoingApplicationSid;
  private readonly logger = new Logger(TwilioService.name);

  constructor(private readonly configService: ConfigService) {
    this.accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    this.accountToken = this.configService.get('TWILIO_AUTH_TOKEN');

    this.voiceToolsTwilioApiKey = this.configService.get('TWILIO_API_KEY');
    this.voiceToolsTwilioSecretKey =
      this.configService.get('TWILIO_API_SECRET');
    this.outgoingApplicationSid = this.configService.get(
      'TWILIO_OUTGOING_APPLICATION_SID',
    );

    this.createClient();
  }

  createClient = () => {
    try {
      this.client = Twilio(this.accountSid, this.accountToken);
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} createClient`,
      );
    }
  };

  getClient = () => {
    return this.client;
  };

  createApiKey = async (friendlyName: string) => {
    const newKey = await this.client.newKeys.create({ friendlyName });
    return newKey;
  };

  retrieveApiKey = async (apiKey: string) => {
    const key = await this.client.keys(apiKey).fetch();
    return key;
  };

  updateApiKey = async (apiKey: string, friendlyName: string) => {
    try {
      const key = await this.client.keys(apiKey).update({ friendlyName });
      return key;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} updateApiKey`,
      );
    }
  };

  deleteApiKey = async (apiKey: string) => {
    try {
      const key = this.client.keys(apiKey).remove();
      return key;
    } catch (e) {
      this.logger.log(e.message, e.stack, `${TwilioService.name} deleteApiKey`);
    }
  };

  getAccessTokenObject = () => {
    return Twilio.jwt.AccessToken;
  };

  /**
   * @param identity string -> hash
   * @param ttl number -> in seconds
   * @returns AccessToken object
   */
  createAccessToken = (identity: number | string, ttl = 3600) => {
    const AccessToken = this.getAccessTokenObject();
    const tokenObject = new AccessToken(
      this.accountSid,
      this.voiceToolsTwilioApiKey,
      this.voiceToolsTwilioSecretKey,
      { identity: `${identity}`, ttl: ttl },
    );
    return tokenObject;
  };

  createVoiceGrant = (incomingAllow = false) => {
    const AccessToken = this.getAccessTokenObject();
    const VoiceGrant = AccessToken.VoiceGrant;
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: this.outgoingApplicationSid,
      incomingAllow: incomingAllow,
    });
    return voiceGrant;
  };

  addGrantToAccessToken = (token: any, grant: any) => {
    // const token = new AccessToken(
    //   twilioAccountSid,
    //   twilioApiKey,
    //   twilioApiSecret,
    //   { identity: identity },
    // );

    // const voiceGrant = new VoiceGrant({
    //   outgoingApplicationSid: outgoingApplicationSid,
    //   incomingAllow: true, // Optional: add to allow incoming calls
    // });

    token.addGrant(grant);
    return token;
  };

  createClientBySidAndToken = (
    accountSid: string,
    accountToken: string,
  ): Twilio.Twilio | null => {
    let client = null;
    try {
      client = Twilio(accountSid, accountToken);
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} createClientBySidAndToken`,
      );
    }

    return client;
  };

  createApiKeyByClient = async (client: any, friendlyName: string) => {
    try {
      const newKey = await client.newKeys.create({ friendlyName });
      return newKey;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} createApiKeyByClient`,
      );
    }

    return null;
  };

  retrieveApiKeyByClient = async (client: any, apiKey: string) => {
    try {
      const key = await client.keys(apiKey).fetch();
      return key;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} retrieveApiKeyByClient`,
      );
    }
  };

  updateApiKeyByClient = async (
    client: any,
    apiKey: string,
    friendlyName: string,
  ) => {
    try {
      const key = await client.keys(apiKey).update({ friendlyName });
      return key;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} updateApiKeyByClient`,
      );
    }
  };

  deleteApiKeyByClient = async (client: any, apiKey: string) => {
    try {
      const key = client.keys(apiKey).remove();
      return key;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} deleteApiKeyByClient`,
      );
    }
  };

  createSubAccount = async (friendlyName: string) => {
    try {
      const subAccount = await this.client.api.v2010.accounts.create({
        friendlyName,
      });
      return subAccount;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} createSubAccount`,
      );
    }

    return null;
  };

  retrieveSubAccount = async (accountSid: string) => {
    try {
      const subAccount = await this.client.api.v2010
        .accounts(accountSid)
        .fetch();
      return subAccount;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} retrieveSubAccount`,
      );
    }

    return null;
  };

  querySubAccountByFriendlyName = async (
    friendlyName: string,
    status: TwilioAccountStatus.ACTIVE,
  ) => {
    try {
      const querySubAccountResponse = await this.client.api.v2010.accounts.list(
        {
          friendlyName,
          limit: TWILIO_ACCOUNT_LIST_API_LIMIT,
          status,
        },
      );
      return querySubAccountResponse;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} querySubAccountByFriendlyName`,
      );
    }
  };

  updateSubAccount = async (
    accountSid: string,
    status: string,
    friendlyName: string,
  ) => {
    try {
      let payload = {};
      payload = Object.assign(payload, status ? { status } : null);
      payload = Object.assign(payload, friendlyName ? { friendlyName } : null);

      const subAccount = await this.client.api.v2010
        .accounts(accountSid)
        .update(payload);
      return subAccount;
    } catch (e) {
      this.logger.error(e, e.stack, `${TwilioService.name} updateSubAccount`);
    }

    return null;
  };

  createTwimlApplicationByClient = async (
    client: any,
    voiceMethod: string,
    voiceUrl: string,
    friendlyName: string,
  ) => {
    try {
      const application = await client.applications.create({
        voiceMethod,
        voiceUrl,
        friendlyName,
      });
      return application;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} createTwimlApplicationByClient`,
      );
    }

    return null;
  };

  retrieveTwimlApplicationByClient = async (
    client: any,
    applicationSid: string,
  ) => {
    try {
      const application = await client.applications(applicationSid).fetch();
      return application;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} retrieveTwimlApplicationByClient`,
      );
    }

    return null;
  };

  retrieveTwimlApplicationByClientAndFriendlyName = async (
    client: any,
    friendlyName: string,
  ) => {
    try {
      const applicationResponse = await client.applications.list({
        friendlyName,
        limit: 1,
      });
      return applicationResponse;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} retrieveTwimlApplicationByClientAndFriendlyName`,
      );
    }
  };

  updateTwimlApplicationByClient = async (
    client: any,
    applicationSid: string,
    voiceMethod: string | null,
    voiceUrl: string | null,
    friendlyName: string | null,
  ) => {
    try {
      let payload = {};
      payload = Object.assign(payload, voiceMethod ? null : { voiceMethod });
      payload = Object.assign(payload, voiceUrl ? null : { voiceUrl });
      payload = Object.assign(payload, friendlyName ? null : { friendlyName });
      const application = await client
        .applications(applicationSid)
        .update(payload);
      return application;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} updateTwimlApplicationByClient`,
      );
    }

    return null;
  };

  deleteTwimlApplicationByClient = async (
    client: any,
    applicationSid: string,
  ) => {
    try {
      const application = await client.applications(applicationSid).remove();
      return application;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} deleteTwimlApplicationByClient`,
      );
    }

    return null;
  };

  /**
   * @param identity string -> hash
   * @param ttl number -> in seconds
   * @returns AccessToken object
   */
  createAccessTokenBySidAndApiKey = (
    accountSid: string,
    apiKeySid: string,
    apiKeySecret: string,
    identity: number | string,
    ttl = 3600,
  ) => {
    const AccessToken = this.getAccessTokenObject();
    const tokenObject = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
      identity: `${identity}`,
      ttl: ttl,
    });
    return tokenObject;
  };

  createVoiceGrantByApplicationSid = (
    applicationSid: string,
    incomingAllow = false,
  ) => {
    const AccessToken = this.getAccessTokenObject();
    const VoiceGrant = AccessToken.VoiceGrant;
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: applicationSid,
      incomingAllow: incomingAllow,
    });
    return voiceGrant;
  };

  createCredentialPublicKeyByClient = async (
    client: any,
    publicKey: string,
    friendlyName: string,
  ) => {
    try {
      const publicKeyObject =
        await client.accounts.v1.credentials.publicKey.create({
          publicKey,
          friendlyName,
        });
      return publicKeyObject;
    } catch (e) {
      this.logger.error(
        e,
        e.stack,
        `${TwilioService.name} createCredentialPublicKeyByClient`,
      );
    }

    return null;
  };

  createAwsCredentialByClient = async (
    client: any,
    credentials: string,
    friendlyName: string,
  ) => {
    try {
      const awsCredential = await client.accounts.v1.credentials.aws.create({
        credentials,
        friendlyName,
      });
      return awsCredential;
    } catch (e) {
      this.logger.error(
        e,
        e.stack,
        `${TwilioService.name} createAwsCredentialByClient`,
      );
    }

    return null;
  };

  listAwsCredentialsByClient = async (client: any) => {
    try {
      const awsCredentials = await client.accounts.v1.credentials.aws.list();
      return awsCredentials;
    } catch (e) {
      this.logger.error(
        e,
        e.stack,
        `${TwilioService.name} listAwsCredentialsByClient`,
      );
    }

    return null;
  };

  retrieveCallByClient = async (client: any, callsid: string) => {
    try {
      const callDetails = await client.calls(callsid).fetch();
      return callDetails;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} retrieveCallByClient`,
      );
    }

    return null;
  };

  listCallByClientAndParentCallSid = async (client: any, callsid: string) => {
    try {
      const callDetails = await client.calls.list({
        parentCallSid: callsid,
      });
      return callDetails;
    } catch (e) {
      this.logger.error(
        e.message,
        e.stack,
        `${TwilioService.name} listCallByClientAndParentCallSid`,
      );
    }

    return null;
  };

  onApplicationShutdown() {
    return;
  }

  lookUpNumber = async (number: string) => {
    try {
      const numberInfo = await this.client.lookups.v1
        .phoneNumbers(number)
        .fetch();
      return numberInfo;
    } catch (error) {
      return { error };
    }
  };

  generateVoiceResponseTwiml = () => {
    return new Twilio.twiml.VoiceResponse();
  };
}
