module.exports = function(RED) {
  function create(config) {
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
      const { layout, data, ...parameters } = compact([
        sanitizeParameters(configuration, ["layout", "scripts", "merge"]),
        msg.parameters,
        msg.payload
      ]);

      return this.connection.client
        .create(layout, data, parse(parameters))
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("create-record", create);
};
