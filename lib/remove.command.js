module.exports = function remove(args) {
    const account = args.account_name;
    const tokens = getAllTokens();

    if (!(account in tokens)) throw new Error('Account does not exist');
    delete tokens[account];

    syncTokens(tokens);
    console.log('Account removed successfully');
};
