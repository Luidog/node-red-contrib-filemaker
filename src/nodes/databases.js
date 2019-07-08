module.exports = function(RED) {
  function databases(configuration) {
    const { merge, constructParameters } = require("../services");
    RED.nodes.createNode(this, configuration);
    const node = this;
    const { client } = configuration;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      const { credentials } = constructParameters(
        message,
        configuration,
        node.context(),
        ["credentials"]
      );
      const client = await this.connection.client;
      client
        .databases(credentials)
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("dapi-databases", databases);
};
