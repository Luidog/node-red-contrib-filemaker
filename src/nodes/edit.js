module.exports = function(RED) {
  function edit(config) {
    const { compact, merge, parse } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", msg => {
      const { layout,recordId, data, ...parameters } = compact([
        configuration,
        msg.parameters,
        msg.payload
      ]);
      return this.connection.client
        .edit(layout, recordId, data, parse(parameters))
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("edit-record", edit);
};
