module.exports = function(RED) {
  function edit(config) {
    const { merge, constructParameters, castBooleans } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      const { layout, recordId, data, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "scripts", "data", "merge", "recordId"]
      );
      const connection = await this.connection.client;
      connection
        .edit(layout, recordId, data, castBooleans(parameters))
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("dapi-edit-record", edit);
};
