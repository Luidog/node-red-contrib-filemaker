module.exports = function(RED) {
  function deleteRecords(config) {
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
      const { layout, recordId, ...parameters } = compact([
        sanitizeParameters(configuration, ["layout", "scripts"]),
        msg.parameters,
        msg.payload
      ]);
      return this.connection.client
        .delete(layout, recordId, parse(parameters))
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("delete-record", deleteRecords);
};
