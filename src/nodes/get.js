module.exports = function(RED) {
  function get(config) {
    const { compact, merge, sanitize } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    const context = node.context();
    node.connection = RED.nodes.getNode(client);
    node.on("input", async msg => {
      console.log("node context", context);
      console.log("node configuration", configuration);
      const { layout, recordId, output, ...parameters } = compact([
        sanitize(configuration, ["layout", "output"])
      ]);
      let connection = await this.connection.client;
      connection
        .get(layout, recordId, parameters)
        .then(response => node.send(merge(msg, output, response)))
        .catch(error => node.error(error.message, msg));
    });
  }
  RED.nodes.registerType("get-record", get);
};
