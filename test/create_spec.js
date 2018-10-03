/* global describe beforeEach afterEach it */

const helper = require("node-red-node-test-helper");
const create = require("../src/nodes/create.js");

helper.init(require.resolve("node-red"));

describe("Create Record Node", function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", function(done) {
    const testFlows = [{ id: "n1", type: "inject" }];
    helper.load(create, testFlows, function() {
      done();
    });
  });
});
