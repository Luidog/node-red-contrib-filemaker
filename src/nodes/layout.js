module.exports = function(RED) {
  function layout(configuration) {
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, configuration);
    const node = this;
    const { client } = configuration;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      const { layout } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout"]
      );
      const client = await this.connection.client;
      client
        .layout(layout)
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("dapi-layout", layout);
};
