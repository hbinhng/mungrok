import { ArgumentsCamelCase, Argv } from 'yargs';
import { Database } from '../database';
import { Command } from './command';

interface IRemoveCommandOption {
  account_name: string;
}

export class RemoveCommand extends Command<IRemoveCommandOption> {
  public constructor() {
    super('remove <account_name>', 'rm', 'Remove existing account');
  }

  protected build(argv: Argv): Argv {
    return argv.positional('account_name', {
      describe: 'Account to be removed',
      type: 'string',
    });
  }

  protected async execute(
    args: ArgumentsCamelCase<IRemoveCommandOption>,
  ): Promise<void> {
    const { account_name: account } = args;

    const database = Database.getInstance();

    const existingToken = database.get(account);

    if (!existingToken) {
      console.error(
        `Cannot remove account: Account "${account}" does not exist`,
      );
      return;
    }

    database.delete(account);
    console.log(`Account "${account}" removed successfully.`);
  }
}
