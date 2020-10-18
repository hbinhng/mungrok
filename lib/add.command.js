module.exports = function add(args) {
    const account = args.account_name;
    const authToken = args.auth_token;

    const tokens = getAllTokens();

    if (account in tokens) throw new Error('Account exists, please remove the existing one first');

    tokens[account] = authToken;
    syncTokens(tokens);
    console.log('Account added successfully');
};
