module.exports = function(RED) {
  function login(config) {
    const { merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client } = config;
    node.connection = RED.nodes.getNode(client);

    node.on("input", async msg => {
      let client = await this.connection.client;
      client
        .login()
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, msg));
    });
  }
  RED.nodes.registerType("login", login);
};
