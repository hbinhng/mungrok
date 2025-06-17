import { scriptName } from 'yargs';
import { AddCommand } from './commands/add.command';
import { EditCommand } from './commands/edit.command';
import { ListCommand } from './commands/list.command';
import { RemoveCommand } from './commands/remove.command';
import { TunnelCommand } from './commands/tunnel.command';

scriptName('mungrok')
  .usage('$0 [command] [options/arguments]')
  .command(new AddCommand().toYargs())
  .command(new EditCommand().toYargs())
  .command(new ListCommand().toYargs())
  .command(new RemoveCommand().toYargs())
  .command(new TunnelCommand().toYargs())
  .strict()
  .parse(process.argv.slice(2));
