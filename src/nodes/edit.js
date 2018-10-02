module.exports = function(RED) {
  function edit(config) {
    const { compact, merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", msg => {
      const { recordId, data } = msg.payload;
      const { layout, ...parameters } = compact([
        configuration,
        msg.parameters
      ]);
      return this.connection.client
        .edit(layout, recordId, data, parameters)
        .then(response => node.send(merge(msg, { payload: response })))
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("edit-record", edit);
};
