module.exports = function(RED) {
  function layouts(config) {
    const { send, handleError } = require("../services");
    const { client, output } = config;

    RED.nodes.createNode(this, config);

    const node = this;

    node.client = RED.nodes.getNode(client);

    node.status({ fill: "blue", shape: "dot", text: "Loading" });

    node.handleEvent = ({ connected, message }) =>
      node.status(
        connected
          ? { fill: "green", shape: "dot", text: message }
          : { fill: "red", shape: "dot", text: message }
      );

    /* istanbul ignore else  */
    if (node.client) node.client.on("status", node.handleEvent);

    node.on("input", async message => {
      node.status({ fill: "yellow", shape: "dot", text: "Processing" });
      try {
        await this.client.connection;

        const client = await this.client.client;

        if (client instanceof Error) throw client;

        client
          .layouts()
          .then(response => send(node, output, message, response))
          .catch(error => handleError(node, error.message, message));
      } catch (error) {
        handleError(node, error.message, message);
      }
    });

    node.on("close", () =>
      node.client.removeListener("status", node.handleEvent)
    );
  }
  RED.nodes.registerType("dapi-layouts", layouts);
};
