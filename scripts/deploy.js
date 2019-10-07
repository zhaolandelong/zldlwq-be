/* eslint-disable no-console */
const nodemiral = require("nodemiral");
const { USER, USER_PASSWD, ZLDLWQ_IP, PROJECT_PATH } = process.env;

const commands = [
  `cd ${PROJECT_PATH}`,
  "git fetch",
  "git reset --hard origin/master",
  "rm -rf node_modules/",
  "yarn",
  "yarn tsc",
  "yarn stop",
  "yarn start"
];
const shellCommand = commands.join(" && ");

nodemiral
  .session(ZLDLWQ_IP, {
    username: USER,
    password: USER_PASSWD
  })
  .execute(shellCommand, (err, code, logs) => {
    console.log(`'${shellCommand}' executed`);
    if (err) {
      console.error({ err, code, logs });
    }
  });
