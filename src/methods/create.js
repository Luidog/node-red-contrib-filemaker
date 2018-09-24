module.exports = function(RED) {
  function create(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.connection = RED.nodes.getNode(config.client);
    node.on("input", msg => {
      let record = {};
      record[config.field] = msg.payload;
      this.connection.client
        .create(config.layout, record)
        .then(response => {
          console.log(response);
          node.send({ payload: response });
        })
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("create-record", create);
};
