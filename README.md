# mungrok
Run multiple ngrok accounts on one machine

Usage: &nbsp; `mungrok [command] [argument]`

Commands:

- `mungrok add <account_name> <auth_token>`:
    - Shorthand: `mungrok a <account_name> <auth_token>`
    - Description: Add new account
- `mungrok remove <account_name>`:
    - Shorthand: `mungrok rm <account_name>`
    - Description: Remove existing account
- `mungrok list`:
    - Shorthand: `mungrok ls`
    - Description: List all existing accounts
- `mungrok listen [account_name] [, --protocol[, --address[, --region]]]`:
    - Shorthand: `mungrok l [account_name] [, -p[, -a[, -r]]]`
    - Description: Create ngrok tunnel using random account (using `account_name` if provided)
    - Options:
        - `--protocol/-p`: Local server / tunnel protocol
            - Choices: `['tcp', 'http', 'tls']`
            - Default: `'http'`
        - `--address/-a`: Local server address
            - Default: `'localhost:80'`
        - `--region/-r`: Ngrok server location
            - Choices: `['us', 'eu', 'ap', 'au']`
            - Default: `'ap'`
- `mungrok edit <account_name> <auth_token>`:
    - Shorthand: `mungrok e <account_name> <auth_token>`
    - Description: Replace existing account's auth token with new auth token, you can do the same job with `mungrok remove` + `mungrok add`

*Note: To run mungrok/ngrok on termux (android), you have to turn on mobile hotspot.

From βεαΣτ with &hearts;