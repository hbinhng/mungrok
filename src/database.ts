import { mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { Crypto } from './crypto';

export class Database {
  private static instance: Database | null = null;

  private static readonly storagePath = join(homedir(), '.mungrok');
  private static readonly tokenFile = join(Database.storagePath, 'tokens.bin');

  private isRead = false;
  private readonly data: Record<string, string> = {};

  private constructor() {
    mkdirSync(Database.storagePath, { recursive: true });
  }

  private read() {
    if (this.isRead) return;
    this.isRead = true;

    try {
      const decryptedData = Crypto.getInstance().readEncryptedFile(
        Database.tokenFile,
      );

      Object.assign(this, { data: JSON.parse(decryptedData ?? '{}') });
    } catch {}
  }

  private write() {
    Crypto.getInstance().writeEncryptedFile(
      Database.tokenFile,
      JSON.stringify(this.data),
    );
  }

  public list(): [string, string][] {
    this.read();
    return Object.entries(this.data);
  }

  public get(account: string): string | undefined {
    this.read();
    return this.data[account];
  }

  public put(account: string, token: string): void {
    this.read();
    this.data[account] = token;
    this.write();
  }

  public delete(account: string): void {
    this.read();
    delete this.data[account];
    this.write();
  }

  public static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }
}
