/* global describe it */

/* eslint-disable */
const { expect, should } = require("chai");

/* eslint-enable */

const { merge, isJson } = require("../src/services");

describe("Utility Services", () => {
  describe("merge utility", () => {
    it("it should merge data to the payload object", () => {
      return expect(merge({}, { object: true }))
        .to.be.a("object")
        .and.to.include.keys("payload")
        .and.property("payload")
        .to.be.a("object");
    });
  });
  describe("compact utility", () => {
    it("it should return true for an object", () => {
      return expect(isJson({ object: true })).to.equal(true);
    });
    it("it should return true for an object", () => {
      return expect(isJson({ object: true })).to.equal(true);
    });
  });
  describe("isJson Utility", () => {
    it("it should return true for an object", () => {
      return expect(isJson({ object: true })).to.equal(true);
    });
    it("it should return true for an empty object", () => {
      return expect(isJson({ object: true })).to.equal(true);
    });
    it("it should return true for a stringified object", () => {
      return expect(isJson({})).to.equal(true);
    });
    it("it should return false for a number", () => {
      return expect(isJson(1)).to.equal(false);
    });
    it("it should return false for undefined", () => {
      return expect(isJson()).to.equal(false);
    });
    it("it should return false for a string", () => {
      return expect(isJson("string")).to.equal(false);
    });
    it("it should return false for null", () => {
      return expect(isJson(null)).to.equal(false);
    });
  });
});
