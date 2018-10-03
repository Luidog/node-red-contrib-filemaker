module.exports = function(RED) {
  function find(config) {
    const { compact, merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", msg => {
      const query = configuration.query || msg.payload;
      const { layout, data, ...parameters } = compact([
        configuration,
        msg.parameters
      ]);
      return this.connection.client
        .find(layout, query, parameters)
        .then(response =>
          node.send(merge(msg, data ? response.data : response))
        )
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("perform-find", find);
};
