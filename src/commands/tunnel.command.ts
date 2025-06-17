import { forward, Listener } from '@ngrok/ngrok';
import { ArgumentsCamelCase, Argv } from 'yargs';
import { Database } from '../database';
import { Command } from './command';

interface ITunnelCommandOption {
  account_name: string;
  protocol?: 'http' | 'tcp' | 'tls';
  address?: string;
  region?: string;
}

export class TunnelCommand extends Command<ITunnelCommandOption> {
  public constructor() {
    super(
      'tunnel [account_name]',
      'l',
      'Start a tunnel (with specified account)',
    );
  }

  private decorateLocalAddress(address: string, proto: string): string {
    if (address.match(/^\d+$/)) return proto + '://localhost:' + address;
    if (address.match(/^:\d+$/)) return proto + '://localhost' + address;
    if (address.match(/^\w+\:\d+$/)) return proto + '://' + address;
    if (address.match(/^\w+$/)) return proto + '://' + address;

    return address;
  }

  protected build(argv: Argv): Argv {
    return argv
      .positional('account_name', {
        describe:
          'Select specified account to use, leave it to use randomized one',
        type: 'string',
      })
      .option('protocol', {
        alias: 'p',
        type: 'string',
        choices: ['http', 'tcp', 'tls'],
        default: 'http',
        describe: 'Tunnel protocol',
      })
      .option('address', {
        alias: 'a',
        type: 'string',
        default: '80',
        describe: 'Local address',
      })
      .option('region', {
        alias: 'r',
        type: 'string',
        choices: ['us', 'eu', 'ap', 'au'],
        default: 'ap',
        describe: 'Ngrok server location',
      });
  }

  private async tryCreateListener(
    token: string,
    options: ITunnelCommandOption,
  ): Promise<Listener | null> {
    try {
      const listener = await forward({
        region: options.region,
        proto: options.protocol,
        addr: options.address,
        authtoken: token,
      });

      return listener;
    } catch {
      return null;
    }
  }

  protected async execute(
    args: ArgumentsCamelCase<ITunnelCommandOption>,
  ): Promise<void> {
    const { address, protocol, account_name: account } = args;

    const database = Database.getInstance();

    if (account) {
      const token = database.get(account);

      if (!token)
        return console.error(
          `Cannot create tunnel: Account "${account}" does not exist`,
        );

      const listener = await this.tryCreateListener(
        database.get(account),
        args,
      );

      if (!listener)
        return console.error(
          `Cannot create tunnel: Failed to create listener for account "${account}"`,
        );

      await listener.join();
    }

    const accounts = database.list();

    for (const [account, token] of accounts) {
      const listener = await this.tryCreateListener(token, args);

      if (!listener) {
        console.error(
          `Cannot create tunnel: Failed to create listener for account "${account}"`,
        );
        continue;
      }

      console.log(`Tunnel started for account "${account}":`);
      console.log(
        `${listener.url()} -> ${this.decorateLocalAddress(address, protocol)}`,
      );

      try {
        await listener.join();
      } catch (err) {
        console.error(`Cannot create tunnel: Failed to join listener`);
        continue;
      }

      break;
    }

    console.error(`Cannot create tunnel: All accounts failed to start`);
  }
}
