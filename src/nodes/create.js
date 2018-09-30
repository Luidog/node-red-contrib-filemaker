module.exports = function(RED) {
  function create(config) {
    const { compact, merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    node.connection = RED.nodes.getNode(config.client);
    node.on("input", msg => {
      const { payload } = msg
      const { layout, ...parameters } = compact([
        configuration,
        msg.parameters
      ]);
      return this.connection.client
        .create(layout, payload, parameters)
        .then(record => node.send(merge,(msg, record))
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("create-record", create);
};
