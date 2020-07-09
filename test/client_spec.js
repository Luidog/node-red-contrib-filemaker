/* global describe before beforeEach afterEach it */

const path = require("path");
const { expect } = require("chai");
const helper = require("node-red-node-test-helper");
const environment = require("dotenv");
const varium = require("varium");

const createNode = require("../src/nodes/create.js");
const findNode = require("../src/nodes/find.js");
const clientNode = require("../src/client/client.js");
const catchNode = require("./core/25-catch.js");

helper.init(require.resolve("node-red"), { marpat: { url: "poop" } });

const manifestPath = path.join(__dirname, "./env.manifest");

describe("Client Node", function() {
  before(function(done) {
    environment.config({ path: "./test/.env" });
    varium({ manifestPath });
    done();
  });

  describe("Client Save", function() {
    beforeEach(function(done) {
      helper.startServer(done);
    });

    afterEach(function(done) {
      helper.settings({});
      helper.unload();
      helper.stopServer(() =>
        setTimeout(() => {
          done();
        }, "500")
      );
    });

    it("should save on close", function(done) {
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
          helper.stopServer();
          const client = helper.getNode("e5173483.adc92");
          client.emit("close");
          try {
            expect(true).to.eql(true);
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });
  });

  describe("Reused Client Tests", function() {
    beforeEach(function(done) {
      helper.startServer(done);
    });

    afterEach(function(done) {
      helper.settings({});
      helper.unload();
      helper.stopServer(() =>
        setTimeout(() => {
          done();
        }, "500")
      );
    });

    it("should be loaded", function(done) {
      const testFlow = [{ id: "n1", type: "inject" }];
      helper.load(clientNode, testFlow, function() {
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
            helper.settings({});
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
    it("should create a persistent client without ssl", function(done) {
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
          client: "e5173483.adc93",
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
          id: "e5173483.adc93",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          ssl: true,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, createNode, catchNode],
        testFlows,
        {
          "e5173483.adc93": {
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
            helper.settings({});
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
      const testFlow = [
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
    it("should allow a client's server configuration to be modified", function(done) {
      const testFlow = [
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
        testFlow,
        {
          "e5173483.adc92": {
            server: "https://updated.server.com",
            database: process.env.FILEMAKER_DATABASE,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const client = helper.getNode("e5173483.adc92");
          try {
            expect(client)
              .to.be.an("object")
              .with.any.keys("id", "type", "name", "credentials", "connection")
              .and.property("credentials")
              .to.be.an("object")
              .with.any.keys("server", "database", "username", "password")
              .and.property("server")
              .to.eql("https://updated.server.com");
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });
    it("should allow a client's database configuration to be modified", function(done) {
      const testFlow = [
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
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            database: "updated-database",
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const client = helper.getNode("e5173483.adc92");
          try {
            expect(client)
              .to.be.an("object")
              .with.any.keys("id", "type", "name", "credentials", "connection")
              .and.property("credentials")
              .to.be.an("object")
              .with.any.keys("server", "database", "username", "password")
              .and.property("database")
              .to.eql("updated-database");
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });
    it("should allow a client's ssl configuration to be updated", function(done) {
      const testFlow = [
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
          const client = helper.getNode("e5173483.adc92");
          try {
            expect(client)
              .to.be.an("object")
              .with.any.keys("id", "type", "name", "credentials", "connection");
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });
    it("should allow a client's account user configuration to be modified", function(done) {
      const testFlow = [
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
          ssl: false,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, createNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            database: process.env.FILEMAKER_DATABASE,
            username: "updated-username",
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const client = helper.getNode("e5173483.adc92");
          try {
            expect(client)
              .to.be.an("object")
              .with.any.keys("id", "type", "name", "credentials", "connection")
              .and.property("credentials")
              .to.be.an("object")
              .with.any.keys("server", "database", "username", "password")
              .and.property("username")
              .to.eql("updated-username");
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });
    it("should allow a client's SSL configuration to be modified", function(done) {
      const testFlow = [
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
          ssl: true,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, createNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            database: process.env.FILEMAKER_DATABASE,
            username: process.env.FILEMAKER_USERNAME,
            password: "updated-password"
          }
        },
        function() {
          const client = helper.getNode("e5173483.adc92");
          try {
            expect(client)
              .to.be.an("object")
              .with.any.keys("id", "type", "name", "credentials", "connection")
              .and.property("credentials")
              .to.be.an("object")
              .with.any.keys("server", "database", "username", "password")
              .and.property("password")
              .to.eql("updated-password");
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });
    it("should allow a client's account password configuration to be modified", function(done) {
      const testFlow = [
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
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            database: process.env.FILEMAKER_DATABASE,
            username: process.env.FILEMAKER_USERNAME,
            password: "updated-password"
          }
        },
        function() {
          const client = helper.getNode("e5173483.adc92");
          try {
            expect(client)
              .to.be.an("object")
              .with.any.keys("id", "type", "name", "credentials", "connection")
              .and.property("credentials")
              .to.be.an("object")
              .with.any.keys("server", "database", "username", "password")
              .and.property("password")
              .to.eql("updated-password");
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });

    it("should allow multiple clients", function(done) {
      const testFlow = [
        {
          id: "37b558cf.8553c",
          type: "tab",
          label: "Perform Find",
          disabled: false,
          info: ""
        },
        {
          id: "641ec5c9.c3f73c",
          type: "catch",
          z: "37b558cf.8553c",
          name: "",
          scope: null,
          x: 260,
          y: 100,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "cfc785d0.b2ba",
          type: "helper"
        },
        {
          id: "f15d2a17.bbc65",
          type: "dapi-perform-find",
          z: "37b558cf.8553c",
          client: "e5173483.adc92",
          layout: "payload.layout",
          layoutType: "msg",
          limit: "",
          limitType: "num",
          offset: "",
          offsetType: "num",
          sort: "",
          sortType: "none",
          query: "payload.query",
          queryType: "msg",
          scripts: "",
          scriptsType: "none",
          portals: "",
          portalsType: "none",
          output: "payload",
          x: 250,
          y: 40,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "e5173483.adc92",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        },
        {
          id: "e5173483.adc91",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, findNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          },
          "e5173483.adc91": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const findNode = helper.getNode("f15d2a17.bbc65");
          const helperNode = helper.getNode("cfc785d0.b2ba");

          helperNode.on("input", function(msg) {
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload", "error", "_msgid")
                .and.property("error")
                .to.be.a("object")
                .with.any.keys("message", "source")
                .and.property("message")
                .to.be.a("string");
              done();
            } catch (err) {
              done(err);
            }
          });
          findNode.receive({
            payload: { layout: "people", query: { name: "*" } }
          });
        }
      );
    });

    it("should reuse a client if it exists", function(done) {
      const testFlow = [
        {
          id: "37b558cf.8553c",
          type: "tab",
          label: "Perform Find",
          disabled: false,
          info: ""
        },
        {
          id: "641ec5c9.c3f73c",
          type: "catch",
          z: "37b558cf.8553c",
          name: "",
          scope: null,
          x: 260,
          y: 100,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "cfc785d0.b2ba",
          type: "helper"
        },
        {
          id: "f15d2a17.bbc65",
          type: "dapi-perform-find",
          z: "37b558cf.8553c",
          client: "e5173483.adc92",
          layout: "payload.layout",
          layoutType: "msg",
          limit: "",
          limitType: "num",
          offset: "",
          offsetType: "num",
          sort: "",
          sortType: "none",
          query: "payload.query",
          queryType: "msg",
          scripts: "",
          scriptsType: "none",
          portals: "",
          portalsType: "none",
          output: "payload",
          x: 250,
          y: 40,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "e5173483.adc92",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        },
        {
          id: "e5173483.adc91",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://clients" } });
      helper.load(
        [clientNode, findNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          },
          "e5173483.adc91": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const findNode = helper.getNode("f15d2a17.bbc65");
          const helperNode = helper.getNode("cfc785d0.b2ba");

          helperNode.on("input", function(msg) {
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload", "error", "_msgid")
                .and.property("error")
                .to.be.a("object")
                .with.any.keys("message", "source")
                .and.property("message")
                .to.be.a("string");
              done();
            } catch (err) {
              done(err);
            }
          });
          findNode.receive({
            payload: { layout: "people", query: { name: "*" } }
          });
        }
      );
    });

    it("should handle datastore errors", function(done) {
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
          client: "e5173483.adc94",
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
          id: "e5173483.adc94",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "dapi" } });
      helper.load(
        [clientNode, createNode, catchNode],
        testFlows,
        {
          "e5173483.adc94": {
            server: process.env.FILEMAKER_SERVER,
            database: process.env.FILEMAKER_DATABASE,
            username: process.env.FILEMAKER_USERNAME
          }
        },
        function() {
          const createNode = helper.getNode("db596a45.2ca398");
          const helperNode = helper.getNode("369e311d.23d2de");
          helperNode.on("input", function(msg) {
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload", "error")
                .and.property("error")
                .to.be.a("object")
                .with.any.keys("message", "source");
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

  describe("New Client Tests", function() {
    beforeEach(function(done) {
      helper.startServer(done);
    });

    afterEach(function(done) {
      helper.settings({});
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
      helper.load(clientNode, testFlow, function() {
        done();
      });
    });
    it("should create a persistent client without SSL", function(done) {
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
          client: "e5173483.adc94",
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
          id: "e5173483.adc94",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          ssl: false,
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
            helper.settings({});
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload")
                .and.property("payload")
                .to.be.a("object")
                .with.any.keys("layout");
              done();
            } catch (err) {
              done(err);
            }
          });
          createNode.receive({ payload: { layout: "people" } });
        }
      );
    });
     it("should update a persistent client to use SSL", function(done) {
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
          client: "e5173483.adc94",
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
          id: "e5173483.adc94",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          ssl: true,
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
            helper.settings({});
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload")
                .and.property("payload")
                .to.be.a("object")
                .with.any.keys("layout");
              done();
            } catch (err) {
              done(err);
            }
          });
          createNode.receive({ payload: { layout: "people" } });
        }
      );
    });
    it("should create a persistent client with SSL", function(done) {
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
          client: "e5173483.adc93",
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
          id: "e5173483.adc93",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          ssl: true,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://ssl-client" } });
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
            helper.settings({});
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload")
                .and.property("payload")
                .to.be.a("object")
                .with.any.keys("layout");
              done();
            } catch (err) {
              done(err);
            }
          });
          createNode.receive({ payload: { layout: "people" } });
        }
      );
    });
    it("should allow a client's account ssl configuration to be turned off", function(done) {
      const testFlow = [
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
          ssl: false,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, createNode, catchNode],
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
          const client = helper.getNode("e5173483.adc92");
          try {
            expect(client)
              .to.be.an("object")
              .with.any.keys("id", "type", "name", "credentials", "connection")
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });
    it("should allow a client's account ssl configuration to be turned on", function(done) {
      const testFlow = [
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
          ssl: true,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, createNode, catchNode],
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
          const client = helper.getNode("e5173483.adc92");
          try {
            expect(client)
              .to.be.an("object")
              .with.any.keys("id", "type", "name", "credentials", "connection")
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });

    it("should allow multiple clients", function(done) {
      const testFlow = [
        {
          id: "37b558cf.8553c",
          type: "tab",
          label: "Perform Find",
          disabled: false,
          info: ""
        },
        {
          id: "641ec5c9.c3f73c",
          type: "catch",
          z: "37b558cf.8553c",
          name: "",
          scope: null,
          x: 260,
          y: 100,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "cfc785d0.b2ba",
          type: "helper"
        },
        {
          id: "f15d2a17.bbc65",
          type: "dapi-perform-find",
          z: "37b558cf.8553c",
          client: "e5173483.adc92",
          layout: "payload.layout",
          layoutType: "msg",
          limit: "",
          limitType: "num",
          offset: "",
          offsetType: "num",
          sort: "",
          sortType: "none",
          query: "payload.query",
          queryType: "msg",
          scripts: "",
          scriptsType: "none",
          portals: "",
          portalsType: "none",
          output: "payload",
          x: 250,
          y: 40,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "e5173483.adc92",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        },
        {
          id: "e5173483.adc91",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, findNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          },
          "e5173483.adc91": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const findNode = helper.getNode("f15d2a17.bbc65");
          const helperNode = helper.getNode("cfc785d0.b2ba");

          helperNode.on("input", function(msg) {
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload", "error", "_msgid")
                .and.property("error")
                .to.be.a("object")
                .with.any.keys("message", "source")
                .and.property("message")
                .to.be.a("string");
              done();
            } catch (err) {
              done(err);
            }
          });
          findNode.receive({
            payload: { layout: "people", query: { name: "*" } }
          });
        }
      );
    });
    
    it("should allow multiple clients with mixed SSL", function(done) {
      const testFlow = [
        {
          id: "37b558cf.8553c",
          type: "tab",
          label: "Perform Find",
          disabled: false,
          info: ""
        },
        {
          id: "641ec5c9.c3f73c",
          type: "catch",
          z: "37b558cf.8553c",
          name: "",
          scope: null,
          x: 260,
          y: 100,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "cfc785d0.b2ba",
          type: "helper"
        },
        {
          id: "f15d2a17.bbc65",
          type: "dapi-perform-find",
          z: "37b558cf.8553c",
          client: "e5173483.adc92",
          layout: "payload.layout",
          layoutType: "msg",
          limit: "",
          limitType: "num",
          offset: "",
          offsetType: "num",
          sort: "",
          sortType: "none",
          query: "payload.query",
          queryType: "msg",
          scripts: "",
          scriptsType: "none",
          portals: "",
          portalsType: "none",
          output: "payload",
          x: 250,
          y: 40,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "e5173483.adc92",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        },
        {
          id: "e5173483.adc91",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          ssl: true,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, findNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          },
          "e5173483.adc91": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const findNode = helper.getNode("f15d2a17.bbc65");
          const helperNode = helper.getNode("cfc785d0.b2ba");

          helperNode.on("input", function(msg) {
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload", "error", "_msgid")
                .and.property("error")
                .to.be.a("object")
                .with.any.keys("message", "source")
                .and.property("message")
                .to.be.a("string");
              done();
            } catch (err) {
              done(err);
            }
          });
          findNode.receive({
            payload: { layout: "people", query: { name: "*" } }
          });
        }
      );
    });


    it("should create a client of one does not exist", function(done) {
      const testFlow = [
        {
          id: "37b558cf.8553c",
          type: "tab",
          label: "Perform Find",
          disabled: false,
          info: ""
        },
        {
          id: "641ec5c9.c3f73c",
          type: "catch",
          z: "37b558cf.8553c",
          name: "",
          scope: null,
          x: 260,
          y: 100,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "cfc785d0.b2ba",
          type: "helper"
        },
        {
          id: "f15d2a17.bbc65",
          type: "dapi-perform-find",
          z: "37b558cf.8553c",
          client: "e5173483.adc92",
          layout: "payload.layout",
          layoutType: "msg",
          limit: "",
          limitType: "num",
          offset: "",
          offsetType: "num",
          sort: "",
          sortType: "none",
          query: "payload.query",
          queryType: "msg",
          scripts: "",
          scriptsType: "none",
          portals: "",
          portalsType: "none",
          output: "payload",
          x: 250,
          y: 40,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "e5173483.adc92",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        },
        {
          id: "e5173483.adc91",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://clients" } });
      helper.load(
        [clientNode, findNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          },
          "e5173483.adc91": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const findNode = helper.getNode("f15d2a17.bbc65");
          const helperNode = helper.getNode("cfc785d0.b2ba");

          helperNode.on("input", function(msg) {
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload", "error", "_msgid")
                .and.property("error")
                .to.be.a("object")
                .with.any.keys("message", "source")
                .and.property("message")
                .to.be.a("string");
              done();
            } catch (err) {
              done(err);
            }
          });
          findNode.receive({
            payload: { layout: "people", query: { name: "*" } }
          });
        }
      );
    });

    it("should reuse a client if it exists", function(done) {
      const testFlow = [
        {
          id: "37b558cf.8553c",
          type: "tab",
          label: "Perform Find",
          disabled: false,
          info: ""
        },
        {
          id: "641ec5c9.c3f73c",
          type: "catch",
          z: "37b558cf.8553c",
          name: "",
          scope: null,
          x: 260,
          y: 100,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "cfc785d0.b2ba",
          type: "helper"
        },
        {
          id: "f15d2a17.bbc65",
          type: "dapi-perform-find",
          z: "37b558cf.8553c",
          client: "e5173483.adc92",
          layout: "payload.layout",
          layoutType: "msg",
          limit: "",
          limitType: "num",
          offset: "",
          offsetType: "num",
          sort: "",
          sortType: "none",
          query: "payload.query",
          queryType: "msg",
          scripts: "",
          scriptsType: "none",
          portals: "",
          portalsType: "none",
          output: "payload",
          x: 250,
          y: 40,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "e5173483.adc92",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        },
        {
          id: "e5173483.adc91",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://clients" } });
      helper.load(
        [clientNode, findNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          },
          "e5173483.adc91": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const findNode = helper.getNode("f15d2a17.bbc65");
          const helperNode = helper.getNode("cfc785d0.b2ba");

          helperNode.on("input", function(msg) {
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload", "error", "_msgid")
                .and.property("error")
                .to.be.a("object")
                .with.any.keys("message", "source")
                .and.property("message")
                .to.be.a("string");
              done();
            } catch (err) {
              done(err);
            }
          });
          findNode.receive({
            payload: { layout: "people", query: { name: "*" } }
          });
        }
      );
    });

    it("should handle datastore errors", function(done) {
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
          client: "e5173483.adc94",
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
          id: "e5173483.adc94",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "dapi" } });
      helper.load(
        [clientNode, createNode, catchNode],
        testFlows,
        {
          "e5173483.adc94": {
            server: process.env.FILEMAKER_SERVER,
            database: process.env.FILEMAKER_DATABASE,
            username: process.env.FILEMAKER_USERNAME
          }
        },
        function() {
          const createNode = helper.getNode("db596a45.2ca398");
          const helperNode = helper.getNode("369e311d.23d2de");
          helperNode.on("input", function(msg) {
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload", "error")
                .and.property("error")
                .to.be.a("object")
                .with.any.keys("message", "source");
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

  describe("Client Configuration Tests", function() {
    beforeEach(function(done) {
      helper.startServer(done);
    });

    afterEach(function(done) {
      helper.settings({});
      helper.unload();
      helper.stopServer(() =>
        setTimeout(() => {
          delete global.MARPAT;
          done();
        }, "500")
      );
    });

    it("should create a persistent client without SSL", function(done) {
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
          ssl: false,
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
            helper.settings({});
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

    it("should create a persistent client with SSL", function(done) {
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
            helper.settings({});
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

    it("should reuse a client without SSL", function(done) {
      const testFlow = [
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
          ssl: false,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, createNode, catchNode],
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

    it("should allow a client's server configuration to be modified without SSL", function(done) {
      const testFlow = [
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
          ssl: false,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, createNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: "https://updated.server.com",
            database: process.env.FILEMAKER_DATABASE,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const client = helper.getNode("e5173483.adc92");
          try {
            expect(client)
              .to.be.an("object")
              .with.any.keys("id", "type", "name", "credentials", "connection")
              .and.property("credentials")
              .to.be.an("object")
              .with.any.keys("server", "database", "username", "password")
              .and.property("server")
              .to.eql("https://updated.server.com");
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });

    it("should allow a client's database configuration to be modified without SSL", function(done) {
      const testFlow = [
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
          ssl: true,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, createNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            database: "updated-database",
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const client = helper.getNode("e5173483.adc92");
          try {
            expect(client)
              .to.be.an("object")
              .with.any.keys("id", "type", "name", "credentials", "connection")
              .and.property("credentials")
              .to.be.an("object")
              .with.any.keys("server", "database", "username", "password")
              .and.property("database")
              .to.eql("updated-database");
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });
    it("should allow a client's SSL configuration to be modified", function(done) {
      const testFlow = [
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
          ssl: true,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://dapi" } });
      helper.load(
        [clientNode, createNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            database: process.env.FILEMAKER_DATABASE,
            username: "updated-username",
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const client = helper.getNode("e5173483.adc92");
          try {
            expect(client)
              .to.be.an("object")
              .with.any.keys("id", "type", "name", "credentials","connection");
            done();
          } catch (err) {
            done(err);
          }
        }
      );
    });

    it("should create a client of one does not exist", function(done) {
      const testFlow = [
        {
          id: "37b558cf.8553c",
          type: "tab",
          label: "Perform Find",
          disabled: false,
          info: ""
        },
        {
          id: "641ec5c9.c3f73c",
          type: "catch",
          z: "37b558cf.8553c",
          name: "",
          scope: null,
          x: 260,
          y: 100,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "cfc785d0.b2ba",
          type: "helper"
        },
        {
          id: "f15d2a17.bbc65",
          type: "dapi-perform-find",
          z: "37b558cf.8553c",
          client: "e5173483.adc92",
          layout: "payload.layout",
          layoutType: "msg",
          limit: "",
          limitType: "num",
          offset: "",
          offsetType: "num",
          sort: "",
          sortType: "none",
          query: "payload.query",
          queryType: "msg",
          scripts: "",
          scriptsType: "none",
          portals: "",
          portalsType: "none",
          output: "payload",
          x: 250,
          y: 40,
          wires: [["cfc785d0.b2ba"]]
        },
        {
          id: "e5173483.adc92",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          usage: true
        },
        {
          id: "e5173483.adc91",
          type: "dapi-client",
          z: "",
          name: "Node-RED Test Client",
          ssl: true,
          usage: true
        }
      ];
      helper.settings({ marpat: { url: "nedb://clients" } });
      helper.load(
        [clientNode, findNode, catchNode],
        testFlow,
        {
          "e5173483.adc92": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          },
          "e5173483.adc91": {
            server: process.env.FILEMAKER_SERVER,
            username: process.env.FILEMAKER_USERNAME,
            password: process.env.FILEMAKER_PASSWORD
          }
        },
        function() {
          const findNode = helper.getNode("f15d2a17.bbc65");
          const helperNode = helper.getNode("cfc785d0.b2ba");

          helperNode.on("input", function(msg) {
            try {
              expect(msg)
                .to.be.an("object")
                .with.any.keys("payload", "error", "_msgid")
                .and.property("error")
                .to.be.a("object")
                .with.any.keys("message", "source")
                .and.property("message")
                .to.be.a("string");
              done();
            } catch (err) {
              done(err);
            }
          });
          findNode.receive({
            payload: { layout: "people", query: { name: "*" } }
          });
        }
      );
    });
  });
});
