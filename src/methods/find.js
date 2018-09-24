module.exports = function(RED) {
  function find(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.connection = RED.nodes.getNode(config.client);
    node.on("input", msg =>
      this.connection.client
        .find(config.layout, msg.query)
        .then(response => node.send(response))
        .catch(error => node.error(error.message, error))
    );
  }
  RED.nodes.registerType("perform-find", find);
};
