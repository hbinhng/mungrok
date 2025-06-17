import { ArgumentsCamelCase, Argv } from 'yargs';
import { Database } from '../database';
import { Command } from './command';

export class ListCommand extends Command<void> {
  public constructor() {
    super('list', 'ls', 'List all accounts');
  }

  protected build(argv: Argv): Argv {
    return argv.option('long', {
      alias: 'l',
      type: 'boolean',
      default: false,
      describe: 'Print full token',
    });
  }

  protected async execute(args: ArgumentsCamelCase<void>): Promise<void> {
    const { long } = args;

    const database = Database.getInstance();
    const accounts = database.list();

    if (accounts.length === 0) {
      console.log('No accounts found.');
      return;
    }

    console.table(
      accounts.map(([account, token]) => ({
        account,
        token: long ? token : '...' + token.slice(-12),
      })),
    );
  }
}
