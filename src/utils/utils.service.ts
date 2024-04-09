import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import * as fs from 'fs';
import { promisify } from 'util';

import {
  MOMENT_DATETIME_FORMAT,
  MOMENT_DATE_FORMAT,
  MOMENT_TIME_FORMAT,
} from 'src/constants/constants';

@Injectable()
export class UtilsService {
  private readonly logger = new Logger(UtilsService.name);

  constructor() {}

  convertToTimezoneDate = (date: Date, timezoneString: string) => {
    const convertedDateStr = new Date(date).toLocaleString('en-US', {
      timeZone: timezoneString,
    });
    const convertedDate = new Date(convertedDateStr);
    return convertedDate;
  };

  formatDate = (date: Date, timeStamp = false) => {
    if (timeStamp) {
      return moment(date).format(MOMENT_DATETIME_FORMAT);
    }
    return moment(date).format(MOMENT_DATE_FORMAT);
  };

  // function to format seconds in minutes and seconds
  formatTime = (seconds: number): string => {
    const date = new Date(null);
    if (isNaN(seconds) || seconds === Infinity) {
      return '00:00';
    }
    date.setSeconds(seconds);
    return date.toISOString().slice(14, 19);
  };

  convertDateObjectToTime(date: Date) {
    return moment(date).format(MOMENT_TIME_FORMAT);
  }

  removeDuplicates = (list: any[]) => {
    return list.filter((value: any, index: number, array: any[]) => {
      return array.indexOf(value) === index;
    });
  };

  removeNullAndUndefinedValues = (list: any[]) => {
    return list.filter((value: any) => {
      if (value === null || value === undefined) {
        return false;
      }
      return true;
    });
  };

  toNumber = (value: any): number => {
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
      return null;
    }
    return parsedValue;
  };

  toString = (value: any): string => {
    return String(value);
  };

  shouldInterceptUrl = (url: string): boolean => {
    const urlsToNotIntercept = ['/v1/ping'];

    const shouldIntercept = !urlsToNotIntercept.includes(url);
    return shouldIntercept;
  };

  writeToFile = async (data: string, localFilePath: string) => {
    try {
      await fs.promises.access(
        localFilePath,
        fs.constants.F_OK | fs.constants.W_OK,
      );
      await fs.promises.appendFile(localFilePath, data);
    } catch (err) {
      try {
        await fs.promises.writeFile(localFilePath, data);
      } catch (e) {
        this.logger.error('Error writing file:', e);
        throw e;
      }
    }
  };

  deleteFile = async (localFilePath: string) => {
    try {
      await fs.promises.unlink(localFilePath);
    } catch (e) {
      this.logger.error('Error deleting file:', e);
    }
  };

  readFile = async (localFilePath: string) => {
    try {
      const data = await fs.promises.readFile(localFilePath, 'utf8');
      return data;
    } catch (e) {
      this.logger.error('Error reading file:', e);
    }
  };

  arrayToObject = (arr: any[], key: string) => {
    const obj = {};
    for (const i in arr) {
      !key ? (obj[i] = arr[i]) : (obj[arr[i][key]] = arr[i]);
    }

    return obj;
  };

  isNumeric = (value: string): boolean => {
    return /^\d+$/.test(value);
  };

  sleep = async (ms: number) => await promisify(setTimeout)(ms);

  getCurrentWeek = () => {
    const curr = new Date();
    const week = [];

    for (let i = 1; i <= 7; i++) {
      const first = curr.getDate() - curr.getDay() + i;
      const day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
      week.push(day);
    }
    return week;
  };

  parseFromDate(dateString: string) {
    let [date] = dateString.split(' ');
    [date] = dateString.split('T');

    if (!date) {
      throw new Error(`Invalid date ${dateString}`);
    }

    return `${date} 00:00:00`;
  }

  parseToDate(dateString: string) {
    let [date] = dateString.split(' ');
    [date] = dateString.split('T');

    if (!date) {
      throw new Error(`Invalid date ${dateString}`);
    }

    return `${date} 23:59:59`;
  }

  deepCopy = (v: any) => {
    return JSON.parse(JSON.stringify(v));
  };

  // Function to generate a random integer within a range
  getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
}
