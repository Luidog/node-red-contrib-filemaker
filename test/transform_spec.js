/* global describe beforeEach afterEach it */
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const transformNode = require("../src/nodes/transform.js");
const clientNode = require("../src/client/client.js");
const listNode = require("../src/nodes/list.js");
const catchNode = require("./core/25-catch.js");

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
    const testFlows = [{ id: "n1", type: "inject" }];
    helper.load(transformNode, testFlows, function() {
      done();
    });
  });
  it("should transform an array of objects", function(done) {
    const testFlow = [
      {
        id: "bb39084f.0bba9",
        type: "tab",
        label: "Transform Data",
        disabled: false,
        info: ""
      },
      {
        id: "1a8a1be2.50d8e4",
        type: "helper"
      },
      {
        id: "242464a4.f640e4",
        type: "catch",
        z: "bb39084f.0bba9",
        name: "",
        scope: null,
        x: 580,
        y: 100,
        wires: [["1a8a1be2.50d8e4"]]
      },
      {
        id: "d5b348ab.46ac08",
        type: "dapi-list-records",
        z: "bb39084f.0bba9",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "",
        limitType: "num",
        offset: "",
        offsetType: "num",
        sort: "",
        sortType: "none",
        scripts: "",
        scriptsType: "none",
        portals: "",
        portalsType: "none",
        output: "payload",
        x: 330,
        y: 40,
        wires: [["84f24eb5.f61b6"]]
      },
      {
        id: "84f24eb5.f61b6",
        type: "dapi-transform",
        z: "bb39084f.0bba9",
        parameters: "",
        parameterType: "none",
        data: "payload.data",
        dataType: "msg",
        output: "payload.data",
        x: 540,
        y: 40,
        wires: [["1a8a1be2.50d8e4"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      }
    ];
    helper.load(
      [clientNode, listNode, transformNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        var listNode = helper.getNode("d5b348ab.46ac08");
        var helperNode = helper.getNode("1a8a1be2.50d8e4");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.a("object")
              .and.property("data")
              .to.be.a("array")
              .and.property(0)
              .to.be.a("object")
              .with.any.keys("recordId", "modId");
            done();
          } catch (err) {
            done(err);
          }
        });
        listNode.receive({
          payload: {
            layout: "people"
          }
        });
      }
    );
  });

  it("should transform a single object", function(done) {
    const testFlow = [
      {
        id: "bb39084f.0bba9",
        type: "tab",
        label: "Transform Data",
        disabled: false,
        info: ""
      },
      {
        id: "1a8a1be2.50d8e4",
        type: "helper"
      },
      {
        id: "242464a4.f640e4",
        type: "catch",
        z: "bb39084f.0bba9",
        name: "",
        scope: null,
        x: 580,
        y: 100,
        wires: [["1a8a1be2.50d8e4"]]
      },
      {
        id: "d5b348ab.46ac08",
        type: "dapi-list-records",
        z: "bb39084f.0bba9",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        limit: "",
        limitType: "num",
        offset: "",
        offsetType: "num",
        sort: "",
        sortType: "none",
        scripts: "",
        scriptsType: "none",
        portals: "",
        portalsType: "none",
        output: "payload",
        x: 330,
        y: 40,
        wires: [["84f24eb5.f61b6"]]
      },
      {
        id: "84f24eb5.f61b6",
        type: "dapi-transform",
        z: "bb39084f.0bba9",
        parameters: "",
        parameterType: "none",
        data: "payload.data[0]",
        dataType: "msg",
        output: "payload.data",
        x: 540,
        y: 40,
        wires: [["1a8a1be2.50d8e4"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      }
    ];
    helper.load(
      [clientNode, listNode, transformNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        var listNode = helper.getNode("d5b348ab.46ac08");
        var helperNode = helper.getNode("1a8a1be2.50d8e4");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.a("object")
              .and.property("data")
              .to.be.a("object")
              .with.any.keys("recordId", "modId");
            done();
          } catch (err) {
            done(err);
          }
        });
        listNode.receive({
          payload: {
            layout: "people"
          }
        });
      }
    );
  });
  it("should throw an error with a message and a code", function(done) {
    const testFlow = [
      {
        id: "bb39084f.0bba9",
        type: "tab",
        label: "Transform Data",
        disabled: false,
        info: ""
      },
      {
        id: "1a8a1be2.50d8e4",
        type: "helper"
      },
      {
        id: "242464a4.f640e4",
        type: "catch",
        z: "bb39084f.0bba9",
        name: "",
        scope: null,
        x: 580,
        y: 100,
        wires: [["1a8a1be2.50d8e4"]]
      },
      {
        id: "84f24eb5.f61b6",
        type: "dapi-transform",
        z: "bb39084f.0bba9",
        parameters: "",
        parameterType: "none",
        data: "payload.data",
        dataType: "msg",
        output: "payload.data",
        x: 540,
        y: 40,
        wires: [["1a8a1be2.50d8e4"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      }
    ];
    helper.load(
      [clientNode, transformNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        var transformNode = helper.getNode("84f24eb5.f61b6");
        var helperNode = helper.getNode("1a8a1be2.50d8e4");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload", "error")
              .and.property("error")
              .to.be.an("object")
              .with.any.keys("message", "source");
            done();
          } catch (err) {
            done(err);
          }
        });
        transformNode.receive({
          payload: { data: "data" }
        });
      }
    );
  });
});
