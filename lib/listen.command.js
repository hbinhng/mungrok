const ngrok = require('ngrok');

function fixLocal(address, proto) {
    if (address.match(/^\d+$/)) return proto + '://localhost:' + address;
    if (address.match(/^\w+\:\d+$/)) return proto + '://' + address;
    if (address.match(/^\w+$/)) return proto + '://' + address;

    return address;
}

function tryConnect(authtoken, proto, addr, region) {
    return new Promise((resolve, reject) => {
        ngrok.connect({ authtoken, proto, addr, region }).then(resolve).catch(reject);
    });
}

module.exports = function listen(args) {
    const account = args.account_name;
    const tokens = getAllTokens();
    const protocol = args.p;
    const address = args.a;
    const region = args.r;

    if (typeof account === 'undefined') {
        const accounts = Object.keys(tokens);
        let i = 0;

        (function connect(currentAccount) {
            return new Promise((resolve, reject) => {
                tryConnect(tokens[currentAccount], protocol, address, region)
                    .catch(error => {
                        switch (error.error_code) {
                            case 102:
                                return reject(error);

                            default:
                                break;
                        }

                        console.log('Cannot use ' + currentAccount);

                        if (i === accounts.length)
                            return console.error('Cannot create tunnel (ran out of available accounts)');
                        const nextAccount = accounts[i++];
                        console.log('Retrying using ' + nextAccount);

                        return connect(nextAccount);
                    })
                    .then(publicUrl => {
                        resolve({
                            publicUrl,
                            account: currentAccount,
                        });
                    });
            });
        })(accounts[i++])
            .then(data => {
                console.log('Tunnel created successfully using ' + data.account);
                console.log(data.publicUrl + ' -> ' + fixLocal(address, protocol));
            })
            .catch(error => {
                console.error(error.msg);
                process.exit(error.error_code);
            });

        return;
    }

    if (!(account in tokens)) throw new Error('Account does not exist');

    tryConnect(tokens[account], protocol, address, region);
};
