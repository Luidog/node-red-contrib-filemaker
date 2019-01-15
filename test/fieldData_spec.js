/* global describe beforeEach afterEach it */
var { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const clientNode = require("../src/client/client.js");
const createNode = require("../src/nodes/create.js");
const getNode = require("../src/nodes/get.js");
const fieldDataNode = require("../src/nodes/fieldData.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("FieldData Utility Node", function() {
  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", function(done) {
    var testFlows = [{ id: "n1", type: "inject" }];
    helper.load(fieldDataNode, testFlows, function() {
      done();
    });
  });
  it("should transform an array of objects", function(done) {
    var testFlow = [
      {
        id: "737aeefc.65dcd8",
        type: "tab",
        label: "Select Field Data",
        disabled: false,
        info: ""
      },
      {
        id: "4a8a701a.934d4",
        type: "helper"
      },
      {
        id: "ffdef185.7d8578",
        type: "dapi-create-record",
        z: "737aeefc.65dcd8",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        data: "payload.data",
        dataType: "msg",
        scripts: "",
        scriptsType: "none",
        merge: "false",
        mergeType: "bool",
        output: "payload",
        x: 260,
        y: 40,
        wires: [["e3e225bd.df3f68"]]
      },
      {
        id: "a9d649c0.1d3ff",
        type: "catch",
        z: "737aeefc.65dcd8",
        name: "",
        scope: null,
        x: 680,
        y: 100,
        wires: [["4a8a701a.934d4"]]
      },
      {
        id: "e3e225bd.df3f68",
        type: "dapi-get-record",
        z: "737aeefc.65dcd8",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        recordId: "payload.recordId",
        recordIdType: "msg",
        scripts: "",
        scriptsType: "none",
        portals: "",
        portalsType: "none",
        output: "payload",
        x: 450,
        y: 40,
        wires: [["ffd6eb0e.fd17"]]
      },
      {
        id: "ffd6eb0e.fd17",
        type: "dapi-field-data",
        z: "737aeefc.65dcd8",
        data: "payload.data",
        dataType: "msg",
        output: "payload.data",
        x: 660,
        y: 40,
        wires: [["4a8a701a.934d4"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node Red Test Client",
        usage: true
      }
    ];
    helper.load(
      [clientNode, createNode, getNode, fieldDataNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          application: process.env.FILEMAKER_APPLICATION,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        var createNode = helper.getNode("ffdef185.7d8578");
        var helperNode = helper.getNode("4a8a701a.934d4");
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
        createNode.receive({
          payload: { layout: "people", data: { name: "Anakin Skywalker" } }
        });
      }
    );
  });
  it("should transform a a single object", function(done) {
    var testFlow = [
      {
        id: "737aeefc.65dcd8",
        type: "tab",
        label: "Select Field Data",
        disabled: false,
        info: ""
      },
      {
        id: "4a8a701a.934d4",
        type: "helper"
      },
      {
        id: "ffdef185.7d8578",
        type: "dapi-create-record",
        z: "737aeefc.65dcd8",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        data: "payload.data",
        dataType: "msg",
        scripts: "",
        scriptsType: "none",
        merge: "false",
        mergeType: "bool",
        output: "payload",
        x: 260,
        y: 40,
        wires: [["e3e225bd.df3f68"]]
      },
      {
        id: "a9d649c0.1d3ff",
        type: "catch",
        z: "737aeefc.65dcd8",
        name: "",
        scope: null,
        x: 680,
        y: 100,
        wires: [["4a8a701a.934d4"]]
      },
      {
        id: "e3e225bd.df3f68",
        type: "dapi-get-record",
        z: "737aeefc.65dcd8",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        recordId: "payload.recordId",
        recordIdType: "msg",
        scripts: "",
        scriptsType: "none",
        portals: "",
        portalsType: "none",
        output: "payload",
        x: 450,
        y: 40,
        wires: [["ffd6eb0e.fd17"]]
      },
      {
        id: "ffd6eb0e.fd17",
        type: "dapi-field-data",
        z: "737aeefc.65dcd8",
        data: "payload.data[0]",
        dataType: "msg",
        output: "payload.data",
        x: 660,
        y: 40,
        wires: [["4a8a701a.934d4"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node Red Test Client",
        usage: true
      }
    ];
    helper.load(
      [clientNode, createNode, getNode, fieldDataNode, catchNode],
      testFlow,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          application: process.env.FILEMAKER_APPLICATION,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        var createNode = helper.getNode("ffdef185.7d8578");
        var helperNode = helper.getNode("4a8a701a.934d4");
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
        createNode.receive({
          payload: { layout: "people", data: { name: "Anakin Skywalker" } }
        });
      }
    );
  });
  it("should reject with an error message and code", function(done) {
    var testFlow = [
      {
        id: "95ec0b93.d02568",
        type: "tab",
        label: "Select Field Data Error",
        disabled: false,
        info: ""
      },
      {
        id: "453f2d7f.a0fd9c",
        type: "helper"
      },
      {
        id: "5970d726.97a278",
        type: "catch",
        z: "95ec0b93.d02568",
        name: "",
        scope: null,
        x: 300,
        y: 100,
        wires: [["453f2d7f.a0fd9c"]]
      },
      {
        id: "e3d9bda2.01c0d8",
        type: "dapi-field-data",
        z: "95ec0b93.d02568",
        data: "payload.data",
        dataType: "msg",
        output: "payload.data",
        x: 270,
        y: 40,
        wires: [["453f2d7f.a0fd9c"]]
      }
    ];
    helper.load([fieldDataNode, catchNode], testFlow, function() {
      var fieldDataNode = helper.getNode("e3d9bda2.01c0d8");
      var helperNode = helper.getNode("453f2d7f.a0fd9c");
      helperNode.on("input", function(msg) {
        try {
          expect(msg)
            .to.be.an("object")
            .with.any.keys("payload")
            .and.property("payload")
            .to.be.a("object")
            .and.property("data")
            .to.be.a("string");
          done();
        } catch (err) {
          done(err);
        }
      });
      fieldDataNode.receive({
        payload: { data: "none" }
      });
    });
  });
});
