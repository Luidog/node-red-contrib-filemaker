module.exports = function(RED) {
  function deleteRecords(config) {
    const {
      compact,
      merge,
      sanitize,
      constructParameters
    } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      const { layout, recordId, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "scripts", "recordId"]
      );
      let client = await this.connection.client;
      client
        .delete(layout, recordId, parameters)
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("delete-record", deleteRecords);
};
