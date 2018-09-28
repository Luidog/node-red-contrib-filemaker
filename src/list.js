module.exports = function(RED) {
  function list(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    const { client } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", msg => {
      const options = Object.assign(config, msg);
      const { layout, ...parameters } = options;
      return this.connection.client
        .list(layout, parameters)
        .then(response =>
          node.send({ payload: config.select ? response.data : response })
        )
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("list-records", list);
};
