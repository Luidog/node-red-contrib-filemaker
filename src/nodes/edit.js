module.exports = function(RED) {
  function edit(config) {
    const { compact, merge, sanitize } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async msg => {
      const { layout, recordId, data, ...parameters } = cconstructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "scripts", "data", "merge", "recordId"]
      );

      let client = await this.connection.client;
      client
        .edit(layout, recordId, data || {}, parameters)
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, msg));
    });
  }
  RED.nodes.registerType("edit-record", edit);
};
