const ngrok = require('ngrok');

function fixLocal(address, proto) {
    if (address.match(/^\d+$/)) return proto + '://localhost:' + address;
    if (address.match(/^\w+\:\d+$/)) return proto + '://' + address;
    if (address.match(/^\w+$/)) return proto + '://' + address;

    return address;
}

module.exports = function listen(args) {
    const account = args.account_name;
    const tokens = getAllTokens();
    const protocol = args.p;
    const address = args.a;
    const region = args.r;

    if (typeof account === 'undefined') {
        const accounts = Object.keys(tokens);

        (async function connect() {
            for (let i = 0; i < accounts.length; ++i) {
                const currentAccount = accounts[i];
                if (i !== 0) console.log('Retrying using ' + currentAccount);

                try {
                    const publicUrl = await ngrok.connect({
                        authtoken: tokens[currentAccount],
                        proto: protocol,
                        addr: address,
                        region: region,
                    });

                    return Promise.resolve({
                        account: currentAccount,
                        publicUrl: publicUrl,
                    });
                } catch (error) {
                    switch (error.error_code) {
                        case 102:
                            return reject(error);

                        default:
                            break;
                    }

                    console.log('Cannot use ' + currentAccount + ' (' + error.msg + ')');
                }
            }

            return Promise.reject({
                msg: 'Cannot create tunnel (ran out of available accounts)',
                error_code: 99,
            });
        })()
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

    ngrok
        .connect({
            authtoken: tokens[account],
            proto: protocol,
            addr: address,
            region: region,
        })
        .then(publicUrl => {
            console.log('Tunnel created successfully using ' + account);
            console.log(publicUrl + ' -> ' + fixLocal(address, protocol));
        })
        .catch(error => {
            console.error(error.msg);
            process.exit(error.error_code);
        });
};
