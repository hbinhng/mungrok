import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomFillSync,
} from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { arch, cpus, platform } from 'os';

export class Crypto {
  private static instance: Crypto | null = null;

  private static readonly ALGORITHM = 'aes-256-cbc';
  private static readonly HARDCODED_HMAC = Buffer.from(
    'd3b07384d113edec49eaa6238ad5ff00',
    'hex',
  );

  private readonly key: Buffer;

  private constructor() {
    this.key = createHmac('sha256', Crypto.HARDCODED_HMAC)
      .update(
        JSON.stringify({
          platform: platform(),
          arch: arch(),
          cpu: cpus()[0]?.model ?? 'unknown',
        }),
      )
      .digest();
  }

  public readEncryptedFile(filePath: string): string | null {
    try {
      const fileContent = readFileSync(filePath);
      const iv = fileContent.subarray(0, 16);
      const encryptedData = fileContent.subarray(16);

      const decipher = createDecipheriv(Crypto.ALGORITHM, this.key, iv);
      const decryptedData = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
      ]);

      return decryptedData.toString('utf8');
    } catch (error) {
      console.error(`Failed to read or decrypt file: ${error.message}`);
      return null;
    }
  }

  public writeEncryptedFile(filePath: string, content: string): void {
    const fileContent: Buffer[] = [];

    const iv = Buffer.from(randomFillSync(new Uint8Array(16)));

    fileContent.push(iv);

    const cipher = createCipheriv(Crypto.ALGORITHM, this.key, iv);
    const encryptedData = Buffer.concat([
      cipher.update(Buffer.from(content, 'utf8')),
      cipher.final(),
    ]);

    fileContent.push(encryptedData);

    const fileBuffer = Buffer.concat(fileContent);
    writeFileSync(filePath, fileBuffer, 'binary');
  }

  public static getInstance(): Crypto {
    if (!Crypto.instance) Crypto.instance = new Crypto();
    return Crypto.instance;
  }
}
