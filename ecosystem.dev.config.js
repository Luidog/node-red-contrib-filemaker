module.exports = {
  apps: [
    {
      name: "node-red-dev",
      script: "./node_modules/.bin/node-red",
      args: "-v -s ./red.dev.config.js",
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development"
      }
    }
  ]
};

