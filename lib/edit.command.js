module.exports = function edit(args) {
    const account = args.account_name;
    const token = args.auth_token;
    const tokens = getAllTokens();

    if (!(account in tokens)) return console.error('Cannot edit account: Account does not exist');
    tokens[account] = token;
    syncTokens(tokens);

    console.log('Account editted successfully');
};
