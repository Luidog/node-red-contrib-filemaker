/* global before describe beforeEach afterEach it */
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const globalsNode = require("../src/nodes/globals.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Set Globals Node", function() {
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
    helper.load(globalsNode, testFlow, function() {
      done();
    });
  });

  it("should set globals", function(done) {
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
        type: "set-globals",
        client: "3783b2da.4346a6",
        layout: "People",
        scripts: "",
        merge: true,
        wires: [["n2"]]
      },
      { id: "n2", type: "helper" }
    ];
    helper.load([clientNode, globalsNode], testFlows, function() {
      const globals = helper.getNode("n1");
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
      globals.receive({
        payload: { data: { "Globals::Field": "Millenium Falcon" } }
      });
    });
  });
  it("should throw an error with a message and a code", function(done) {
    var testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Catch Set Globals Error"
      },
      {
        id: "n2",
        type: "set-globals",
        z: "f1",
        name: "globals node",
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
    helper.load([clientNode, globalsNode, catchNode], testFlow, function() {
      const globals = helper.getNode("n2");
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
      globals.receive({ payload: { data: { parent: "Han Solo" } } });
    });
  });
});
