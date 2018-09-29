module.exports = function(RED) {
  function list(config) {
    const { compact, merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, data, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", msg => {
      const { layout, ...parameters } = compact(configuration, msg.parameters);
      return this.connection.client
        .list(layout, parameters)
        .then(response =>
          node.send(merge(msg, data ? response.data : response))
        )
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("list-records", list);
};
