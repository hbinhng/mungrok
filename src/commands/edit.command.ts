import { ArgumentsCamelCase, Argv } from 'yargs';
import { Database } from '../database';
import { Command } from './command';

interface IEditCommandOption {
  account_name: string;
  auth_token: string;
}

export class EditCommand extends Command<IEditCommandOption> {
  public constructor() {
    super(
      'edit <account_name> <auth_token>',
      'e',
      'Edit auth token of existing account',
    );
  }

  protected build(argv: Argv): Argv {
    return argv
      .positional('account_name', {
        describe: "Saved account's name",
        type: 'string',
      })
      .positional('auth_token', {
        describe: 'Ngrok auth token',
        type: 'string',
      });
  }

  protected async execute(
    args: ArgumentsCamelCase<IEditCommandOption>,
  ): Promise<void> {
    const { account_name: account, auth_token: token } = args;

    const database = Database.getInstance();

    const existingToken = database.get(account);

    if (!existingToken)
      return console.error('Cannot edit account: Account does not exist');

    database.put(account, token);

    console.log(`Account "${account}" updated successfully.`);
  }
}
