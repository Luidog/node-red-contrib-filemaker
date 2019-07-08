module.exports = function(RED) {
  function create(config) {
    const { merge, constructParameters, castBooleans } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      const { layout, data, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "scripts", "data", "merge"]
      );
      const client = await this.connection.client;
      client
        .create(layout, data || {}, castBooleans(parameters))
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("dapi-create-record", create);
};
