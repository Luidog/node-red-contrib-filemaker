/* global before describe beforeEach afterEach it */
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const getNode = require("../src/nodes/get.js");
const createNode = require("../src/nodes/create.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Get Record Node", function() {
  before(function(done) {
    environment.config({ path: "./test/.env" });
    varium(process.env, "./test/env.manifest");
    done();
  });

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(done);
  });

  it("should be loaded", function(done) {
    const testFlow = [{ id: "n1", type: "inject" }];
    helper.load(getNode, testFlow, function() {
      done();
    });
  });

  it("should get a specific record", function(done) {
    var testFlows = [
      {
        id: "815dccb7.ff2788",
        type: "tab",
        label: "Get Record",
        disabled: false,
        info: ""
      },
      {
        id: "fd67ed3.ff0801",
        type: "helper"
      },
      {
        id: "f8b67949.c0a5d",
        type: "dapi-create-record",
        z: "815dccb7.ff2788",
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
        wires: [["9cd0b5a3.6b08d"]]
      },
      {
        id: "fa335834.e85638",
        type: "catch",
        z: "815dccb7.ff2788",
        name: "",
        scope: null,
        x: 460,
        y: 100,
        wires: [["fd67ed3.ff0801"]]
      },
      {
        id: "9cd0b5a3.6b08d",
        type: "dapi-get-record",
        z: "815dccb7.ff2788",
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
        wires: [["fd67ed3.ff0801"]]
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
      [clientNode, createNode, getNode, catchNode],
      testFlows,
      {
        "e5173483.adc92": {
          server: process.env.FILEMAKER_SERVER,
          application: process.env.FILEMAKER_APPLICATION,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const createNode = helper.getNode("f8b67949.c0a5d");
        const helperNode = helper.getNode("fd67ed3.ff0801");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("payload")
              .and.property("payload")
              .to.be.a("object")
              .with.any.keys("data")
              .and.property("data")
              .to.be.an("array")
              .and.property(0)
              .to.be.a("object")
              .to.have.any.keys("modId", "recordId");
            done();
          } catch (err) {
            done(err);
          }
        });
        createNode.receive({
          payload: { layout: "people", data: { name: "Mace Windu" } }
        });
      }
    );
  });
  it("should throw an error with a message and a code", function(done) {
    var testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Catch Get Error"
      },
      {
        id: "n2",
        type: "dapi-get-record",
        z: "f1",
        name: "Get Node",
        client: "3783b2da.4346a6",
        layout: "Devices",
        scripts: "",
        merge: true,
        wires: [["n3"]]
      },
      {
        id: "n3",
        type: "helper",
        z: "f1"
      },
      {
        id: "3783b2da.4346a6",
        type: "dapi-client",
        name: "Node Red Test Client",
        usage: true
      },
      {
        id: "n1",
        type: "catch",
        z: "f1",
        name: "catch",
        wires: [["n3"]]
      }
    ];
    helper.load(
      [clientNode, getNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          server: process.env.FILEMAKER_SERVER,
          application: process.env.FILEMAKER_APPLICATION,
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const getNode = helper.getNode("n2");
        const helperNode = helper.getNode("n3");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("_msgid", "code", "error", "message");
            done();
          } catch (err) {
            done(err);
          }
        });
        getNode.receive({
          payload: { layout: "people", data: { name: "Anakin Skywalker" } }
        });
      }
    );
  });
});
