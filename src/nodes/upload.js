module.exports = function(RED) {
  function upload(config) {
    const { compact, merge, sanitizeParameters } = require("../services");
    RED.nodes.createNode(this, config);
    const node = this;
    const { client, ...configuration } = config;
    node.connection = RED.nodes.getNode(client);
    node.on("input", msg => {
      const { layout, field, filename, recordId, repetition } = compact([
        sanitizeParameters(configuration, ["filename", "layout", "field"]),
        msg.parameters,
        msg.payload
      ]);
      return this.connection.client
        .upload(filename, layout, field, recordId, repetition)
        .then(response => node.send(merge(msg, response)))
        .catch(error => node.error(error.message, error));
    });
  }
  RED.nodes.registerType("upload-file", upload);
};
