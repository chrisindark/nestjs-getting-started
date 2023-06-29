import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

@Injectable()
export class EncryptionService {
  private readonly algorithm;
  private readonly encryptionSecret;
  private readonly iv;
  private readonly logger = new Logger(EncryptionService.name);

  constructor(private readonly configService: ConfigService) {
    this.algorithm = "aes-256-ctr";
    this.encryptionSecret = configService.get("ENCRYPTION_SECRET");
    this.iv = randomBytes(16);
  }

  encrypt = (value) => {
    const cipher = createCipheriv(
      this.algorithm,
      this.encryptionSecret,
      this.iv,
    );
    let encrypted = cipher.update(value, "utf8", "hex");
    encrypted += cipher.final("hex");
    return this.iv.toString("hex") + ":" + encrypted;
  };

  decrypt(value) {
    const parts = value.split(":");
    const iv = Buffer.from(parts.shift(), "hex");
    const decipher = createDecipheriv(
      this.algorithm,
      this.encryptionSecret,
      iv,
    );
    let decrypted = decipher.update(parts.join(":"), "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
