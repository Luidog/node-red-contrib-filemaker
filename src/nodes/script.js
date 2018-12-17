module.exports = function(RED) {
  function script(config) {
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      const { script, layout, parameter } = constructParameters(
        message,
        configuration,
        node.context(),
        ["script", "layout", "parameter"]
      );
      let connection = await this.connection.client;
      connection
        .script(layout, script, parameter)
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("trigger-script", script);
};
