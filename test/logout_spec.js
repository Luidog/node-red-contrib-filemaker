/* global before describe beforeEach afterEach it */

const path = require("path");
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");

const logoutNode = require("../src/nodes/logout.js");
const loginNode = require("../src/nodes/login.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"));

const manifestPath = path.join(__dirname, "./env.manifest");

describe("Logout Node", function() {
  before(function(done) {
    environment.config({ path: "./test/.env" });
    varium({ manifestPath });
    done();
  });

  beforeEach(function(done) {
    helper.startServer(done);
  });

  afterEach(function(done) {
    helper.unload();
    helper.stopServer(() =>
      setTimeout(() => {
        delete global.MARPAT;
        done();
      }, "500")
    );
  });

  it("should be loaded", function(done) {
    const testFlow = [{ id: "n1", type: "inject" }];
    helper.load(logoutNode, testFlow, function() {
      done();
    });
  });
  it("should close a Data API Session", function(done) {
    const testFlow = [
      {
        id: "6962fe42.cdf3c8",
        type: "tab",
        label: "Logout",
        disabled: false,
        info: ""
      },
      {
        id: "cf630498.a2d95",
        type: "catch",
        z: "6962fe42.cdf3c8",
        name: "",
        scope: null,
        x: 420,
        y: 100,
        wires: [["e9ddafb9.e26ad"]]
      },
      {
        id: "e9ddafb9.e26ad",
        type: "helper"
      },
      {
        id: "3b340eca.5904c2",
        type: "dapi-logout",
        z: "6962fe42.cdf3c8",
        client: "e5173483.adc92",
        output: "payload",
        x: 420,
        y: 40,
        wires: [["e9ddafb9.e26ad"]]
      },
      {
        id: "64a87699.ec6f2",
        type: "dapi-login",
        z: "6962fe42.cdf3c8",
        client: "e5173483.adc92",
        output: "token",
        x: 260,
        y: 40,
        wires: [["3b340eca.5904c2"]]
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
      [clientNode, loginNode, logoutNode, catchNode],
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
        const loginNode = helper.getNode("64a87699.ec6f2");
        const helperNode = helper.getNode("e9ddafb9.e26ad");
        helperNode.on("input", function(msg) {
          try {
            expect(msg)
              .to.be.an("object")
              .with.any.keys("_msgid", "payload")
              .and.property("payload")
              .to.be.an("object")
              .with.any.keys("response", "message");
            done();
          } catch (err) {
            done(err);
          }
        });
        loginNode.receive({ payload: {} });
      }
    );
  });
  it("should throw an error with a message and a code", function(done) {
    const testFlows = [
      {
        id: "f1",
        type: "tab",
        z: "f1",
        label: "Logout Error Test"
      },
      {
        id: "3783b2da.4346a6",
        type: "dapi-client",
        name: "Sweet FM Client",
        usage: true
      },
      {
        id: "n1",
        z: "f1",
        type: "dapi-logout",
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
          server: process.env.FILEMAKER_SERVER,
          database: process.env.FILEMAKER_DATABASE,
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
  it("should throw an error if a client cannot be initialized", function(done) {
    const testFlows = [
      {
        id: "f1",
        type: "tab",
        z: "f1",
        label: "Logout Error Test"
      },
      {
        id: "3783b2da.4346a6",
        type: "dapi-client",
        name: "Sweet FM Client",
        usage: true
      },
      {
        id: "n1",
        z: "f1",
        type: "dapi-logout",
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
          database: process.env.FILEMAKER_DATABASE,
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
