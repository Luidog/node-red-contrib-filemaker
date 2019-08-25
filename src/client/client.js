const _ = require("lodash");
const { Filemaker } = require("fms-api-client");
const { connect } = require("marpat");

function configurationNode(RED) {
  function Client(n) {
    RED.nodes.createNode(this, n);
    const { concurrency, id, timeout } = n;
    const store = _.get(RED.settings, "marpat.url", "nedb://memory");
    const options = _.get(RED.settings, "marpat.options", {});

    this.connection = new Promise((resolve, reject) =>
      connect(
        store,
        options
      )
        .then(db =>
          Filemaker.findOne({ name: id }).then(client => {
            if (!client) {
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
            }
            this.emit("status", { connected: true, message: "Ready" });

            return client.save();
          })
        )
        .then(client => resolve(client))
        .catch(({ message }) => {
          this.client = false;
          this.emit("status", { connected: false, message });
          reject(message);
        })
    );
    this.on("close", function(done) {
      this.client
        .save()
        .then(client => done())
        .catch(error => {
          this.error(error.message);
          done();
        });
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
