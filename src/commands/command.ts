import { ArgumentsCamelCase, Argv, CommandModule } from 'yargs';

export abstract class Command<OptionType> {
  protected readonly aliases: string[];

  public constructor(
    protected readonly syntax: string,
    aliases: string[] | string | undefined,
    protected readonly description: string,
  ) {
    if (typeof aliases === 'string') this.aliases = [aliases];
    else if (Array.isArray(aliases)) this.aliases = aliases;
    else this.aliases = [];
  }

  protected abstract build(argv: Argv): Argv;
  protected abstract execute(
    args: ArgumentsCamelCase<OptionType>,
  ): Promise<void>;

  public getSyntax(): string[] {
    const syntaxParts = this.syntax.split(' ');
    if (this.aliases) syntaxParts.push(...this.aliases);
    return syntaxParts;
  }

  public getDescription(): string {
    return this.description;
  }

  public toYargs(): CommandModule {
    const command: CommandModule = {
      command: this.syntax,
      describe: this.getDescription(),
      builder: (ys: Argv) => this.build(ys),
      handler: (args: ArgumentsCamelCase<OptionType>) => this.execute(args),
    };

    if (this.aliases.length) command.aliases = this.aliases;

    return command;
  }
}
