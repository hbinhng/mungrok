import { ArgumentsCamelCase, Argv } from 'yargs';
import { Database } from '../database';
import { Command } from './command';

interface IAddCommandOption {
  account_name: string;
  auth_token: string;
}

export class AddCommand extends Command<IAddCommandOption> {
  public constructor() {
    super('add <account_name> <auth_token>', 'a', 'Add new account');
  }

  protected build(argv: Argv): Argv {
    return argv
      .positional('account_name', {
        describe: 'Ngrok username',
        type: 'string',
      })
      .positional('auth_token', {
        describe: 'Ngrok auth token',
        type: 'string',
      });
  }

  protected async execute(
    args: ArgumentsCamelCase<IAddCommandOption>,
  ): Promise<void> {
    const { account_name: account, auth_token: token } = args;

    const database = Database.getInstance();

    const existingToken = database.get(account);

    if (existingToken) {
      console.error(
        `Cannot add account: Account "${account}" already exists, please remove the existing one first.`,
      );
      return;
    }

    database.put(account, token);
    console.log(`Account "${account}" added successfully.`);
  }
}
