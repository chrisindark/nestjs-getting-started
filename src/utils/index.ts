import * as http from "https";
import * as fs from "fs";
import * as path from "path";
import * as apm from "elastic-apm-node";
import { v4 as uuidv4 } from "uuid";

class Utils {
  static catchWithApm(error, options, context = null) {
    if (context) {
      apm.setCustomContext(context);
    }

    apm.captureError(error, options, (err, id) => {
      // console.debug(err, id);
    });
  }

  static getInQueryString(length: number): string {
    let str = ``;
    for (let i = 1; i <= length; i++) {
      str += i !== length ? " ?, " : " ? ";
    }
    return `(${str})`;
  }

  static getInsertQueryString(length): string {
    let str = ``;
    for (let i = 1; i <= length; i++) {
      str += i !== length ? " ?, " : " ? ";
    }
    return `${str}`;
  }

  static formatDate = (date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  static arrayToObject = (arr, key) => {
    const obj = {};
    for (const i in arr) {
      !key ? (obj[i] = arr[i]) : (obj[arr[i][key]] = arr[i]);
    }

    return obj;
  };

  static groupArrayToObject = (arr, key1, key2) => {
    const obj = {};

    for (const i in arr) {
      !(arr[i][key1] in obj)
        ? (obj[arr[i][key1]] = [arr[i][key2]])
        : obj[arr[i][key1]].push(arr[i][key2]);
    }
    return obj;
  };

  static getCurrentWeek = () => {
    const curr = new Date();
    const week = [];

    for (let i = 1; i <= 7; i++) {
      const first = curr.getDate() - curr.getDay() + i;
      const day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
      week.push(day);
    }
    // console.log(week);
    return week;
  };

  static getLastWeek = () => {
    const d = new Date();
    const to = d.setTime(
      d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000,
    );
    const from = d.setTime(d.getTime() - 6 * 24 * 60 * 60 * 1000);
    const week = [new Date(from).toISOString(), new Date(to).toISOString()];
    return week;
  };

  static parseFromDate(dateString: string) {
    const [date] = dateString.split(" ");

    if (!date) {
      throw new Error(`Invalid date ${dateString}`);
    }

    return `${date} 00:00:00`;
  }

  static parseToDate(dateString: string) {
    const [date] = dateString.split(" ");

    if (!date) {
      throw new Error(`Invalid date ${dateString}`);
    }

    return `${date} 23:59:59`;
  }

  static getFileExtension(filename: string): string {
    const filenameParts = filename.split(".");
    let extension = "";

    if (filenameParts.length > 1) {
      extension = filenameParts[filenameParts.length - 1];
    }

    return extension;
  }

  static async downloadFileFromUrl(url: string): Promise<string> {
    const dest = path.join(__dirname, "../../media/", uuidv4());
    const file = fs.createWriteStream(dest);

    await new Promise<void>((resolve, reject) => {
      http
        .get(url, (response) => {
          response.pipe(file);

          file.on("finish", () => {
            file.close();
            return resolve();
          });
        })
        .on("error", (err) => {
          fs.unlink(dest, () => reject(err));
        });
    });

    return dest;
  }

  static async getFileSize(filePath: string): Promise<any> {
    const fileSizeInBytes = await new Promise<number>((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          reject(err);
        } else {
          resolve(stats.size);
        }
      });
    });

    return fileSizeInBytes;
  }

  static async deleteFile(filePath: string): Promise<boolean> {
    try {
      await fs.promises.rm(filePath, {
        force: true,
      });
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}

const instance = new Utils();
export default Utils;
