module.exports = function(RED) {
  function Client(n) {
    const { connect } = require("marpat");
    const { Filemaker } = require("fms-api-client");
    RED.nodes.createNode(this, n);
    this.client = connect("nedb://memory")
      .then(db => Filemaker.create(n))
      .then(client => client.save());
  }
  RED.nodes.registerType("filemaker-api-client", Client);
};
