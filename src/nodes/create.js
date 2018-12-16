module.exports = function(RED) {
  function create(config) {
    const {
      compact,
      merge,
      sanitize,
      constructParameters
    } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async message => {
      const { layout, data, ...parameters } = constructParameters(
        message,
        configuration,
        node.context(),
        ["layout", "scripts", "data", "merge"]
      );
      let client = await this.connection.client;
      client
        .create(
          layout,
          data || {},
          Object.assign(parameters, {
            merge: parameters.merge !== "false" ? true : false
          })
        )
        .then(response =>
          node.send(merge(configuration.output, message, response))
        )
        .catch(error => node.error(error.message, message));
    });
  }
  RED.nodes.registerType("create-record", create);
};
