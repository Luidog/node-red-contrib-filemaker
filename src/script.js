module.exports = function(RED) {
  function script(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.connection = RED.nodes.getNode(config.client);
    node.on("input", msg =>
      this.connection.client
        .script(config.script, config.layout, msg.payload)
        .then(response => node.send(response))
        .catch(error => node.error("script error", error))
    );
  }
  RED.nodes.registerType("trigger-script", script);
};
