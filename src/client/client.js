const _ = require("lodash");
const { Filemaker } = require("fms-api-client");
const { connect } = require("marpat");

function configurationNode(RED) {
  if (!global.MARPAT) global.MARPAT = {};
  function Client(n) {
    RED.nodes.createNode(this, n);
    const { concurrency, id, timeout } = n;
    const store = _.get(RED.settings, "marpat.url", "nedb://memory");
    const options = _.get(RED.settings, "marpat.options", {});

    if (!global.MARPAT.CONNECTION) {
      global.MARPAT.CONNECTION = new Promise((resolve, reject) =>
        connect(
          store,
          options
        )
          .then(db => {
            this.client = Filemaker.findOne({ name: id })
              .then(client => {
                if (!client) {
                  this.emit("status", { connected: true, message: "Ready" });
                  return Filemaker.create(
                    Object.assign(
                      {
                        name: id,
                        concurrency: parseInt(concurrency) || 1,
                        timeout: parseInt(timeout) || 0
                      },
                      {
                        database: this.credentials.database,
                        server: this.credentials.server,
                        user: this.credentials.username,
                        password: this.credentials.password
                      }
                    )
                  ).save();
                } else {
                  client.agent.connection.starting = false;
                  client.agent.connection.queue = [];
                  client.agent.connection.pending = [];
                  if (
                    client.agent.connection.password !==
                    this.credentials.password
                  ) {
                    client.agent.connection.password = this.credentials.password;
                    client.agent.connection.sessions = [];
                  }
                  if (client.agent.connection.user !== this.credentials.user) {
                    client.agent.connection.user = this.credentials.user;
                    client.agent.connection.sessions = [];
                  }
                  if (
                    client.agent.connection.server !== this.credentials.server
                  ) {
                    client.agent.connection.server = this.credentials.server;
                    client.agent.connection.sessions = [];
                  }
                  if (
                    client.agent.connection.database !==
                    this.credentials.database
                  ) {
                    client.agent.connection.database = this.credentials.database;
                    client.agent.connection.sessions = [];
                  }
                  client.agent.timeout = parseInt(timeout) || 0;
                  client.agent.concurrency = parseInt(concurrency) || 1;
                  this.emit("status", { connected: true, message: "Ready" });

                  return client.save();
                }
              })
              .catch(error =>
                this.emit("status", {
                  connected: false,
                  message: error.message
                })
              );
            resolve(db);
          })
          .catch(error => reject(error))
      );
      this.connection = global.MARPAT.CONNECTION;
    } else {
      this.connection = global.MARPAT.CONNECTION;
      global.MARPAT.CONNECTION.then(db => {
        this.client = Filemaker.findOne({ name: id })
          .then(client => {
            if (!client) {
              this.emit("status", { connected: true, message: "Ready" });
              return Filemaker.create(
                Object.assign(
                  {
                    name: id,
                    concurrency: parseInt(concurrency) || 1,
                    timeout: parseInt(timeout) || 0
                  },
                  {
                    database: this.credentials.database,
                    server: this.credentials.server,
                    user: this.credentials.username,
                    password: this.credentials.password
                  }
                )
              ).save();
            } else {
              client.agent.connection.starting = false;
              client.agent.connection.queue = [];
              client.agent.connection.pending = [];
              if (
                client.agent.connection.password !== this.credentials.password
              ) {
                client.agent.connection.password = this.credentials.password;
                client.agent.connection.sessions = [];
              }
              if (client.agent.connection.user !== this.credentials.user) {
                client.agent.connection.user = this.credentials.user;
                client.agent.connection.sessions = [];
              }
              if (client.agent.connection.server !== this.credentials.server) {
                client.agent.connection.server = this.credentials.server;
                client.agent.connection.sessions = [];
              }
              if (
                client.agent.connection.database !== this.credentials.database
              ) {
                client.agent.connection.database = this.credentials.database;
                client.agent.connection.sessions = [];
              }
              client.agent.timeout = parseInt(timeout) || 0;
              client.agent.concurrency = parseInt(concurrency) || 1;
              this.emit("status", { connected: true, message: "Ready" });
              return client.save();
            }
          })
          .catch(error => {
            this.emit("status", { connected: false, message: error.message });
            console.log(error);
            reject(error);
          });
      });
    }
    this.on("close", function(done) {
      this.client
        ? this.client
            .save()
            .then(client => done())
            .catch(error => done())
        : done();
    });
  }
  RED.nodes.registerType("dapi-client", Client, {
    credentials: {
      server: { type: "text" },
      database: { type: "text" },
      username: { type: "text" },
      password: { type: "password" }
    }
  });
}

module.exports = configurationNode;
