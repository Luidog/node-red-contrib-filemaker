module.exports = function(RED) {
  function globals(config) {
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      let connection = await this.connection.client;
      let { data } = constructParameters(
        message,
        configuration,
        node.context(),
        ["data"]
      );
      connection
        .globals(data)
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("set-globals", globals);
};
