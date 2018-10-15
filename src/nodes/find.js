module.exports = function(RED) {
  function find(config) {
    const {
      compact,
      merge,
      parse,
      sanitizeParameters
    } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", msg => {
      const { layout, data, query, ...parameters } = compact([
        sanitizeParameters(configuration, [
          "layout",
          "limit",
          "offset",
          "sort",
          "query",
          "scripts",
          "portals",
          "data"
        ]),
        msg.parameters,
        msg.payload
      ]);
      return this.connection.client
        .find(layout, query, parse(parameters))
        .then(response =>
          node.send(merge(msg, data ? response.data : response))
        )
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("perform-find", find);
};
