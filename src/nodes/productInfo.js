module.exports = function(RED) {
  function productInfo(configuration) {
    const { send, handleError } = require("../services");
    RED.nodes.createNode(this, configuration);
    const node = this;
    const { client } = configuration;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const connection = await this.connection.client;
      connection
        .productInfo()
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });
  }
  RED.nodes.registerType("dapi-product-info", productInfo);
};
