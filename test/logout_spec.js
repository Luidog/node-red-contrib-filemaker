/* global before describe beforeEach afterEach it */
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");
const logoutNode = require("../src/nodes/logout.js");
const loginNode = require("../src/nodes/login.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

describe("Logout Node", function() {
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
    helper.load(logoutNode, testFlow, function() {
      done();
    });
  });
  it("should close a Data API Session", function(done) {
    var testFlow = [
      {
        id: "f1",
        type: "tab",
        label: "Logout Data API Session"
      },
      {
        id: "n2",
        type: "login",
        z: "f1",
        name: "login Node",
        client: "3783b2da.4346a6",
        wires: [["n3"]]
      },
      {
        id: "n3",
        type: "logout",
        z: "f1",
        name: "logout Node",
        client: "3783b2da.4346a6",
        wires: [["n4"]]
      },
      {
        id: "n4",
        type: "helper",
        z: "f1"
      },
      {
        id: "3783b2da.4346a6",
        type: "filemaker-api-client",
        server: process.env.FILEMAKER_SERVER,
        name: "Mute Symphony",
        application: process.env.FILEMAKER_APPLICATION,
        usage: true
      },
      {
        id: "n1",
        type: "catch",
        z: "f1",
        name: "catch",
        wires: [["n4"]]
      }
    ];
    helper.load(
      [clientNode, loginNode, logoutNode, catchNode],
      testFlow,
      {
        "3783b2da.4346a6": {
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const login = helper.getNode("n2");
        const helperNode = helper.getNode("n4");
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
        login.receive({ payload: {} });
      }
    );
  });
  it("should throw an error with a message and a code", function(done) {
    var testFlows = [
      {
        id: "f1",
        type: "tab",
        z: "f1",
        label: "Logout Error Test"
      },
      {
        id: "3783b2da.4346a6",
        type: "filemaker-api-client",
        server: process.env.FILEMAKER_SERVER,
        name: "Sweet FM Client",
        application: process.env.FILEMAKER_APPLICATION,
        usage: true
      },
      {
        id: "n1",
        z: "f1",
        type: "logout",
        client: "3783b2da.4346a6",
        wires: [["n3"]]
      },
      {
        id: "n2",
        type: "catch",
        z: "f1",
        name: "catch",
        wires: [["n3"]]
      },
      { id: "n3", z: "f1", type: "helper" }
    ];
    helper.load(
      [clientNode, logoutNode, catchNode],
      testFlows,
      {
        "3783b2da.4346a6": {
          username: process.env.FILEMAKER_USERNAME,
          password: process.env.FILEMAKER_PASSWORD
        }
      },
      function() {
        const logout = helper.getNode("n1");
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
        logout.receive({ payload: { message: true } });
      }
    );
  });
});
