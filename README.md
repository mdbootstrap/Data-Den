# Data Den

**Scripts**

    npm run start:[package] // start package
    npm run start:all // start all packages
    npm run build:[package] // build package
    npm run build:all // build all packages
    npm run test:[package] // test package
    npm run test:all // test all packages

**NX Commands**

    npx nx run [package] // start package
    npx nx build [package] // build package
    npx nx run-many -t [script] // start/build/test multiple packages

    npx nx graph // show project dependencies

**Publishing**

    npx nx release version --projects=[name1,name2] --dry-run // version update dry run for testing
    npx nx release version --projects=[name1,name2] // version update
    npx nx release publish --projects=[name1,name2] --dry-run // publish dry run for testing
    npx nx release publish --projects=[name1,name2]  // publish

Check more commands here: https://nx.dev/nx-api/nx/documents/run
