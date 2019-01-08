module.exports = function(RED) {
  function get(config) {
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    const context = node.context();
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      let { layout, recordId, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "recordId", "scripts", "portals"]
      );
      let connection = await this.connection.client;
      connection
        .get(layout, recordId, parameters)
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("dapi-get-record", get);
};
