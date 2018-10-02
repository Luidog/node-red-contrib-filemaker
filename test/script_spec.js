/* global describe beforeEach afterEach it */

const helper = require("node-red-node-test-helper");
const script = require("../src/nodes/script.js");

helper.init(require.resolve("node-red"));

describe("Script Node", function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", function(done) {
    const testFlows = [{ id: "n1", type: "inject" }];
    helper.load(script, testFlows, function() {
      done();
    });
  });
});
