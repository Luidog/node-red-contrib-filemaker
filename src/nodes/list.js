module.exports = function(RED) {
  function list(config) {
    const { send, handleError, constructParameters } = require("../services");
    const { client, output, ...configuration } = config;
    RED.nodes.createNode(this, config);
    const node = this;
    node.status({ fill: "blue", shape: "dot", text: "Loading" });

    node.handleEvent = ({ connected, message }) =>
      node.status(
        connected
          ? { fill: "green", shape: "dot", text: message }
          : { fill: "red", shape: "dot", text: message }
      );
    
    node.connection = RED.nodes.getNode(client);
    node.connection.on("status", node.handleEvent);

    node.on("input", async message => {
      node.status({ fill: "yellow", shape: "dot", text: "Processing" });
      const { layout, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "limit", "offset", "sort", "scripts", "portals"]
      );

      const client = await node.connection.client;

      client
        .list(layout, parameters)
        .then(response => send(node, output, message, response))
        .catch(error => handleError(node, error.message, message));
    });

    node.on("close", done => {
      node.connection.removeListener("error", node.handleEvent);
      node.connection.removeListener("status", node.handleEvent);
      done();
    });
  }
  RED.nodes.registerType("dapi-list-records", list);
};
