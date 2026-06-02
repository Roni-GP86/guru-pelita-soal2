// @ts-nocheck
/* eslint-disable */
const serverless = require("serverless-http");
const app = require("../../server");

// module.exports is used for CJS compatibility (package.json type: commonjs)
module.exports.handler = serverless(app);
