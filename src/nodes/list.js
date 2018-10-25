module.exports = function(RED) {
  function list(config) {
    const { compact, merge, sanitize } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", async msg => {
      const { layout, ...parameters } = compact([
        sanitize(configuration, [
          "layout",
          "limit",
          "offset",
          "sort",
          "scripts",
          "portals",
          "data"
        ]),
        msg.parameters,
        msg.payload
      ]);
      let connection = await this.connection.client;
      connection
        .list(layout, parameters)
        .then(response =>
          node.send(merge(msg, Object.assign(msg.payload, response)))
        )
        .catch(error => node.error(error.message, msg));
    });
  }
  RED.nodes.registerType("list-records", list);
};
