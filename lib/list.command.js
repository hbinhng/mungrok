module.exports = function list() {
    const tokens = getAllTokens();
    const columns = process.stdout.columns;
    const nameCols = ~~((1 * columns) / 3) - 1;
    const authCols = columns - nameCols - 3;

    console.log('+' + '-'.repeat(nameCols) + '+' + '-'.repeat(authCols) + '+');
    console.log(
        '|' +
            'Name'.padStart(nameCols / 2, ' ').padEnd(nameCols, ' ') +
            '|' +
            'Auth token'.padStart(authCols / 2, ' ').padEnd(authCols, ' ') +
            '|'
    );
    console.log('+' + '-'.repeat(nameCols) + '+' + '-'.repeat(authCols) + '+');

    Object.keys(tokens).forEach(account => {
        console.log(
            '| ' +
                account.padEnd(nameCols - 2, ' ').substr(0, nameCols - 2) +
                ' | ' +
                tokens[account].padEnd(authCols - 2, ' ').substr(0, authCols - 2) +
                ' |'
        );
        console.log('+' + '-'.repeat(nameCols) + '+' + '-'.repeat(authCols) + '+');
    });
};
