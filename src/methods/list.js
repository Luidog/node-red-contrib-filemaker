module.exports = function(RED) {
  function list(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.connection = RED.nodes.getNode(config.client);
    node.on("input", msg => {
      this.connection.client
        .list(config.layout)
        .then(response => {
          msg.payload = response;
          node.send(msg);
        })
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("list-records", list);
};
