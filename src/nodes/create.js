module.exports = function(RED) {
  function create(config) {
    const { compact, merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", msg => {
      const data = msg.payload;
      const { layout, ...parameters } = compact([
        configuration,
        msg.parameters
      ]);
      return this.connection.client
        .create(layout, data, parameters)
        .then(response => node.send(merge(msg, { payload: response })))
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("create-record", create);
};
