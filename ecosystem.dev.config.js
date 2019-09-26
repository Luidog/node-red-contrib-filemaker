const path = require("path");
const environment = require("dotenv");
const varium = require("varium");

environment.config();

const manifestPath = path.join(__dirname, "./env.manifest");

varium({ manifestPath });

module.exports = {
  apps: [
    {
      name: "node-red-dev",
      script: path.join(__dirname, "./node_modules/.bin/node-red"),
      args: "-v -s ./red.dev.config.js",
      instances: 1,
      out_file: "./logs/output.log",
      autorestart: true,
      watch: true,
      ignore_watch: ["./logs", "./dapi"],
      node_args: "--max_old_space_size=8192",
      env: {
        NODE_ENV: "development",
        PORT: process.env.PORT,
        DATASTORE: process.env.DATASTORE
      }
    }
  ]
};
