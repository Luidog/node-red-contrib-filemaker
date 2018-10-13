/* global describe beforeEach afterEach it */
var { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const transform = require("../src/nodes/transform.js");

helper.init(require.resolve("node-red"));

describe("Transform Utility Node", function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", function(done) {
    var testFlows = [{ id: "n1", type: "inject" }];
    helper.load(transform, testFlows, function() {
      done();
    });
  });
  it("should transform an array of data", function(done) {
    var testFlow = [
      {
        id: "771c5833.7d24d8",
        type: "transform",
        wires: [["n2"]]
      },
      { id: "n2", type: "helper" }
    ];
    helper.load(transform, testFlow, function() {
      var n1 = helper.getNode("771c5833.7d24d8");
      var n2 = helper.getNode("n2");
      n2.on("input", function(msg) {
        try {
          expect(msg)
            .to.be.an("object")
            .with.any.keys("payload")
            .and.property("payload")
            .to.be.a("object")
            .and.property("data")
            .to.be.a("array");
          done();
        } catch (err) {
          done(err);
        }
      });
      n1.receive({
        payload: {
          data: [
            {
              fieldData: {
                name: "George Lucas",
                object: "",
                array: ""
              },
              portalData: {
                Planets: [],
                Vehicles: []
              },
              recordId: "732765",
              modId: "7"
            },
            {
              fieldData: {
                name: "George Lucas",
                object: "",
                array: ""
              },
              portalData: {
                Planets: [],
                Vehicles: []
              },
              recordId: "732765",
              modId: "7"
            }
          ]
        }
      });
    });
  });
  it("should transform a single data object", function(done) {
    var testFlow = [
      {
        id: "771c5833.7d24d8",
        type: "transform",
        wires: [["n2"]]
      },
      { id: "n2", type: "helper" }
    ];
    helper.load(transform, testFlow, function() {
      var n1 = helper.getNode("771c5833.7d24d8");
      var n2 = helper.getNode("n2");
      n2.on("input", function(msg) {
        try {
          expect(msg)
            .to.be.an("object")
            .with.any.keys("payload")
            .and.property("payload")
            .to.be.a("object")
            .and.property("data")
            .to.be.a("object");
          done();
        } catch (err) {
          done(err);
        }
      });
      n1.receive({
        payload: {
          data: {
            fieldData: {
              name: "George Lucas",
              object: "",
              array: ""
            },
            portalData: {
              Planets: [],
              Vehicles: []
            },
            recordId: "732765",
            modId: "7"
          }
        }
      });
    });
  });
  it("should preserve the contents of other payload properties", function(done) {
    var testFlow = [
      {
        id: "771c5833.7d24d8",
        type: "transform",
        wires: [["n2"]]
      },
      { id: "n2", type: "helper" }
    ];
    helper.load(transform, testFlow, function() {
      var n1 = helper.getNode("771c5833.7d24d8");
      var n2 = helper.getNode("n2");
      n2.on("input", function(msg) {
        try {
          expect(msg)
            .to.be.an("object")
            .with.any.keys("payload","test")
            .and.property("payload")
            .to.be.a("object")
            .and.property("data")
            .to.be.a("object");
          done();
        } catch (err) {
          done(err);
        }
      });
      n1.receive({
        payload: {
          test: true,
          data: {
            fieldData: {
              name: "George Lucas",
              object: "",
              array: ""
            },
            portalData: {
              Planets: [],
              Vehicles: []
            },
            recordId: "732765",
            modId: "7"
          }
        }
      });
    });
  });

});
