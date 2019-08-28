module.exports = function(RED) {
  function databases(configuration) {
    const { constructParameters, send, handleError } = require("../services");
    const { client, output } = configuration;

    RED.nodes.createNode(this, configuration);

    const node = this;

    node.configuration = RED.nodes.getNode(client);
    node.status({ fill: "blue", shape: "dot", text: "Loading" });

    node.handleEvent = ({ connected, message }) =>
      node.status(
        connected
          ? { fill: "green", shape: "dot", text: message }
          : { fill: "red", shape: "dot", text: message }
      );

    node.configuration.on("status", node.handleEvent);

    node.on("input", async message => {
      node.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { credentials } = constructParameters(
        message,
        configuration,
        node.context(),
        ["credentials"]
      );
      try {
        await this.configuration.connection;
        const client = await this.configuration.client;
        client
          ? client
              .databases(credentials)
              .then(response => send(node, output, message, response))
              .catch(error => handleError(node, error.message, message))
          : handleError(node, "Failed to load DAPI client.", message);
      } catch (error) {
        console.log(error);
        handleError(node, error.message, message);
      }
    });
    node.on("close", () =>
      node.configuration.removeListener("status", node.handleEvent)
    );
  }
  RED.nodes.registerType("dapi-databases", databases);
};
