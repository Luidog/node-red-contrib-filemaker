module.exports = function(RED) {
  function logout(config) {
    const { send, handleError } = require("../services");
    const { client, output } = config;
    RED.nodes.createNode(this, config);
    const node = this;

    node.status({ fill: "blue", shape: "dot", text: "Loading" });
    node.handleEvent = ({ connected, message }) =>
      node.status(
        connected
          ? { fill: "green", shape: "dot", text: message }
          : { fill: "red", shape: "dot", text: message }
      );

    node.configuration = RED.nodes.getNode(client);
    node.configuration.on("status", node.handleEvent);

    node.on("input", async message => {
      node.status({ fill: "yellow", shape: "dot", text: "Processing" });
      try {
        await this.configuration.connection;

        const client = await this.configuration.client;

        client
          .logout()
          .then(response => send(node, output, message, response))
          .catch(error => handleError(node, error.message, message));
      } catch (error) {
        handleError(node, error.message, message);
      }
    });

    node.on("close", () =>
      node.configuration.removeListener("status", node.handleEvent)
    );
  }
  RED.nodes.registerType("dapi-logout", logout);
};
