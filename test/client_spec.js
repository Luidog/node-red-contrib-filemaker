/* global describe before beforeEach afterEach it */

const helper = require("node-red-node-test-helper");
const fs = require("fs-extra");
const environment = require("dotenv");
const varium = require("varium");
const { expect } = require("chai");
const createNode = require("../src/nodes/create.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Client Node", function() {
  before(function(done) {
    environment.config({ path: "./test/.env" });
    varium(process.env, "./test/env.manifest");
    done();
  });

  beforeEach(function(done) {
    helper.settings({ marpat: { url: "nedb://dapi" } });
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.settings({});
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", function(done) {
    const testFlows = [{ id: "n1", type: "inject" }];
    helper.load(clientNode, testFlows, function() {
      done();
    });
  });
  it("should create a persistent client", function(done) {
    const testFlows = [
      {
        id: "ec096890.cdd65",
        type: "tab",
        label: "Create Record",
        disabled: false,
        info: ""
      },
      {
        id: "369e311d.23d2de",
        type: "helper"
      },
      {
        id: "d3becaad.b78ce",
        type: "catch",
        z: "ec096890.cdd65",
        name: "",
        scope: null,
        x: 360,
        y: 100,
        wires: [["369e311d.23d2de"]]
      },
      {
        id: "db596a45.2ca398",
        type: "dapi-create-record",
        z: "ec096890.cdd65",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        data: "",
        dataType: "none",
        scripts: "",
        scriptsType: "none",
        merge: "false",
        mergeType: "bool",
        output: "payload",
        x: 340,
        y: 40,
        wires: [["369e311d.23d2de"]]
      },
      {
        id: "e5173483.adc92",
        type: "dapi-client",
        z: "",
        name: "Node-RED Test Client",
        usage: true
      }
    ];
    helper.settings({ marpat: { url: "nedb://dapi" } });
    helper.load(
      [clientNode, createNode, catchNode],
      testFlows,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const createNode = helper.getNode("db596a45.2ca398");
        const helperNode = helper.getNode("369e311d.23d2de");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.a("object")
              .with.any.keys("recordId", "modId");
            done();
          } catch (err) {
            done(err);
          }
        });
        createNode.receive({ payload: { layout: "people" } });
      }
    );
  });
  it("should reuse a client", function(done) {
    const testFlows = [
      {
        id: "ec096890.cdd65",
        type: "tab",
        label: "Create Record",
        disabled: false,
        info: ""
      },
      {
        id: "369e311d.23d2de",
        type: "helper"
      },
      {
        id: "d3becaad.b78ce",
        type: "catch",
        z: "ec096890.cdd65",
        name: "",
        scope: null,
        x: 360,
        y: 100,
        wires: [["369e311d.23d2de"]]
      },
      {
        id: "db596a45.2ca398",
        type: "dapi-create-record",
        z: "ec096890.cdd65",
        client: "e5173483.adc92",
        layout: "payload.layout",
        layoutType: "msg",
        data: "",
        dataType: "none",
        scripts: "",
        scriptsType: "none",
        merge: "false",
        mergeType: "bool",
        output: "payload",
        x: 340,
        y: 40,
        wires: [["369e311d.23d2de"]]
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
      [clientNode, createNode, catchNode],
      testFlows,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const createNode = helper.getNode("db596a45.2ca398");
        const helperNode = helper.getNode("369e311d.23d2de");
        helperNode.on("input", function(msg) {
          console.log(msg);
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.a("object")
              .with.any.keys("recordId", "modId");
            done();
          } catch (err) {
            done(err);
          }
        });
        createNode.receive({ payload: { layout: "people" } });
      }
    );
  });
});
