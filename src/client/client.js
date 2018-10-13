module.exports = function(RED) {
  function Client(n) {
    "use strict";

    const { connect } = require("marpat");
    const { Filemaker } = require("fms-api-client");

    RED.nodes.createNode(this, n);
    return connect("nedb://memory")
      .then(db => Filemaker.create(n))
      .then(client => client.save())
      .then(client => (this.client = client));
  }
  RED.nodes.registerType("filemaker-api-client", Client);
};
