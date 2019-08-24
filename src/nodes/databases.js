module.exports = function(RED) {
  function databases(configuration) {
    const { constructParameters, send, handleError } = require("../services");
    const { client, output } = configuration;

    RED.nodes.createNode(this, configuration);

    const node = this;

    node.connection = RED.nodes.getNode(client);
    node.status({ fill: "blue", shape: "dot", text: "Loading" });

    node.handleEvent = ({ connected, message }) =>
      node.status(
        connected
          ? { fill: "green", shape: "dot", text: message }
          : { fill: "red", shape: "dot", text: message }
      );

    node.connection.on("status", node.handleEvent);

    node.on("input", async message => {
      this.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { credentials } = constructParameters(
        message,
        configuration,
        node.context(),
        ["credentials"]
      );

      const client = await this.connection.client;

      client
        ? client
            .databases(credentials)
            .then(response => send(node, output, message, response))
            .catch(error => handleError(node, error.message, message))
        : handleError(node, "Failed to load DAPI client.", message);
    });

    node.on("close", done => {
      node.connection.removeListener("error", node.handleEvent);
      node.connection.removeListener("status", node.handleEvent);
      done();
    });
  }
  RED.nodes.registerType("dapi-databases", databases);
};
