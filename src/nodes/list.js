module.exports = function(RED) {
  function list(config) {
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      const { layout, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "limit", "offset", "sort", "scripts", "portals"]
      );

      let connection = await this.connection.client;
      connection
        .list(layout, parameters)
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("dapi-list-records", list);
};
