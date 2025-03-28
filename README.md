# What do we need to be production ready?


## JS and TS linting

To ensure consistent coding styles when working in teams

- installed eslint and typescript plugin

- added eslint base config `eslint.config.mjs`

- added scripts `lint` and `lint:fix` scripts to `package.json`

- src files should probably be refactored into their own directory for easier linting



## Version Control Exclusion File (.gitIgnore)

To ensure files compiled files, sensitive data files, or files local to your machine are checked into the shared repo

- added a `.gitignore` with some basic stuff



## Environment Variable File (.env)

To hold API keys, database credentials and other secret stuff that shouldn't be hardcoded into your code



## Security 

Protections against attacks like XSS and CSRF. HTTPS encryption between client and server is helpful in preventing this. 

- installed `helmet` package 



## Testing Framework

Unit tests aren't so much about testing your new code, but preventing your new code from creating regressions. This is also why high percentage code coverage is essential. 

- installed `jest`

- added `test` script


## CI/CD Workflows

To run your tests, lintings and other essential build checks when pushing code.


