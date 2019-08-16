const path = require("path");

module.exports = {
  apps: [
    {
      name: "node-red-dev",
      script: path.join(__dirname, "./node_modules/.bin/node-red"),
      args: "-v -s ./red.dev.config.js",
      instances: 1,
      out_file: "./output.log",
      autorestart: true,
      watch: true,
      node_args: "--max_old_space_size=8192",
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};
