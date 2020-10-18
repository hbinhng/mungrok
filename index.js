const yargs = require('yargs');
const path = require('path');
const fs = require('fs');

const isJSON = text => {
    try {
        JSON.parse(text);
        return true;
    } catch {
        return false;
    }
};

if (
    !fs.existsSync(path.join(__dirname, 'tokens.json')) ||
    !isJSON(fs.readFileSync(path.join(__dirname, 'tokens.json')))
)
    fs.writeFileSync(path.join(__dirname, 'tokens.json'), '{}', 'utf-8');

const commands = {
    add: require(path.join(__dirname, 'lib', 'add.command')),
    list: require(path.join(__dirname, 'lib', 'list.command')),
    listen: require(path.join(__dirname, 'lib', 'listen.command')),
    remove: require(path.join(__dirname, 'lib', 'remove.command')),
};

global.getAllTokens = () => require(path.join(__dirname, 'tokens.json'));
global.syncTokens = obj => fs.writeFileSync(path.join(__dirname, 'tokens.json'), JSON.stringify(obj, null, 2), 'utf-8');

yargs
    .scriptName('mungrok')
    .usage('$0 [command] [options/arguments]')
    .command(
        'add <account_name> <auth_token>',
        '',
        ys => {
            ys.positional('account_name', {
                describe: 'Ngrok username',
                type: 'string',
            }).positional('auth_token', {
                describe: 'Ngrok auth token',
                type: 'string',
            });
        },
        commands.add
    )
    .command(
        'remove <account_name>',
        '',
        ys => {
            ys.positional('account_name', {
                describe: 'Ngrok account to be removed',
                type: 'string',
            });
        },
        commands.remove
    )
    .command('list', '', {}, commands.list)
    .command(
        'listen [account_name]',
        '',
        ys => {
            ys.positional('account_name', {
                describe: 'Select specified account to use, leave it to use randomized one',
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
        },
        commands.listen
    )
    .strict()
    .parse(process.argv.slice(2));
