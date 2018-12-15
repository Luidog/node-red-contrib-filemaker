module.exports = function(RED) {
  function list(config) {
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
    node.on("input", async msg => {
      console.log(
        "parameters",
        constructParameters(msg, configuration, node.context(), [
          "layout",
          "limit",
          "offset",
          "sort",
          "scripts",
          "portals"
        ])
      );
      const { layout, ...parameters } = constructParameters(
        msg,
        configuration,
        node.context(),
        ["layout", "limit", "offset", "sort", "scripts", "portals"]
      );
      let connection = await this.connection.client;
      connection
        .list(layout, parameters)
        .then(response => node.send(merge(msg, configuration.output, response)))
        .catch(error => node.error(error.message, msg));
    });
  }
  RED.nodes.registerType("list-records", list);
};
