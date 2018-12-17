module.exports = function(RED) {
  function find(config) {
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      let { layout, query, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        [
          "layout",
          "limit",
          "offset",
          "sort",
          "query",
          "scripts",
          "portals",
          "data"
        ]
      );
      let connection = await this.connection.client;
      connection
        .find(layout, query, parameters)
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("perform-find", find);
};
