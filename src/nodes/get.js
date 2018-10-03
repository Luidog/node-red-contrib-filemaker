module.exports = function(RED) {
  function get(config) {
    const { compact, merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", msg => {
      const { recordId } = msg.payload;
      const { layout, ...parameters } = compact([
        configuration,
        msg.parameters
      ]);
      return this.connection.client
        .get(layout, recordId, parameters)
        .then(response =>
          node.send(merge(msg, response))
        )
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("get-record", get);
};
