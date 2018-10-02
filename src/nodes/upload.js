module.exports = function(RED) {
  function upload(config) {
    const { compact, merge } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", msg => {
      const filename = msg.filename || configuration.filename;
      const { layout, field, recordId } = compact([
        configuration,
        msg.parameters
      ]);
      return this.connection.client
        .upload(filename, layout, field, recordId)
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("upload-file", upload);
};
