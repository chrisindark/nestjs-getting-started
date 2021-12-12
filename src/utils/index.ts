import * as http from "https";
import * as fs from "fs";
import * as path from "path";
import * as apm from "elastic-apm-node";
import { v4 as uuidv4 } from "uuid";

class Utils {
  static CDN_IMAGE_URL_BASE = `https://cdn.trell.co/cdn-cgi/image/w={{SIZE}},h={{SIZE}},fit=scale-down/images/orig`;

  static catchWithApm(error, options, context = null) {
    if (context) {
      apm.setCustomContext(context);
    }

    apm.captureError(error, options, (err, id) => {
      // console.debug(err, id);
    });
  }

  static getModifiedVideoUrl(url: string, type: string): string {
    if (!url) return "";

    let replaceString = "";
    if (type === "preview") {
      replaceString =
        "https://cdn.trell.co/videos/transformed/h_360,w_360/eo_3/videos/orig/";
    } else if (type === "original") {
      replaceString = "https://cdn.trell.co/videos/orig/";
    } else {
      replaceString =
        "https://cdn.trell.co/videos/transformed/h_640,w_640/videos/orig/";
    }

    return url.replace(
      `https://res.cloudinary.com/trell/video/upload/user-videos/videos/orig/`,
      replaceString,
    );
  }

  static getModifiedImageUrl(url: string, type: "small" | "large"): string {
    if (!url) return "";
    const split = url.split("/");
    const id = split[split.length - 1];
    return url.replace(
      `https://d2homc9nx3ot5e.cloudfront.net/expresso/uploads/`,
      type === "small"
        ? `https://cdn.trell.co/w=360,h=360,fit=scale-down/user-images/images/orig/`
        : `https://cdn.trell.co/w=640,h=640,fit=scale-down/user-images/images/orig/`,
    );
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

  static getTrailShareUrl = (slug) => {
    if (slug) {
      return `https://app.trell.co/${slug}`;
    }
    return "";
  };

  static getCurrentWeek = () => {
    let curr = new Date();
    let week = [];

    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i;
      let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
      week.push(day);
    }
    // console.log(week);
    return week;
  };

  static getLastWeek = () => {
    let d = new Date();
    let to = d.setTime(
      d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000,
    );
    let from = d.setTime(d.getTime() - 6 * 24 * 60 * 60 * 1000);
    let week = [new Date(from).toISOString(), new Date(to).toISOString()];
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
    let filenameParts = filename.split(".");
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
