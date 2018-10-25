/* global before describe beforeEach afterEach it */
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const getNode = require("../src/nodes/get.js");
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
        id: "3783b2da.4346a6",
        type: "filemaker-api-client",
        server: process.env.FILEMAKER_SERVER,
        name: "Sweet FM Client",
        application: process.env.FILEMAKER_APPLICATION,
        user: process.env.FILEMAKER_USERNAME,
        password: process.env.FILEMAKER_PASSWORD,
        usage: true
      },
      {
        id: "n1",
        type: "get-record",
        client: "3783b2da.4346a6",
        layout: "People",
        scripts: "",
        merge: true,
        wires: [["n2"]]
      },
      { id: "n2", type: "helper" }
    ];
    helper.load([clientNode, getNode], testFlows, function() {
      const get = helper.getNode("n1");
      const helperNode = helper.getNode("n2");
      helperNode.on("input", function(msg) {
        try {
          expect(msg)
            .to.be.an("object")
            .with.any.keys("payload");
          done();
        } catch (err) {
          done(err);
        }
      });
      get.receive({
        payload: { recordId: 67408 }
      });
    });
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
        type: "get-record",
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
        type: "filemaker-api-client",
        server: process.env.FILEMAKER_SERVER,
        name: "Mute Symphony",
        application: process.env.FILEMAKER_APPLICATION,
        user: process.env.FILEMAKER_USERNAME,
        password: process.env.FILEMAKER_PASSWORD,
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
    helper.load([clientNode, getNode, catchNode], testFlow, function() {
      const get = helper.getNode("n2");
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
      get.receive({ payload: { recordId: "" } });
    });
  });
});
