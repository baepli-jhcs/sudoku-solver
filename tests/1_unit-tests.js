const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  let validString =
    "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1";
  suite("solver.validate(puzzleString)", () => {
    test("Valid Puzzle String", (done) => {
      assert.isTrue(solver.validate(validString));
      done();
    });
    test("Invalid Puzzle String", (done) => {
      assert.equal(
        solver.validate(validString.substring(0, validString.length - 1) + "h")
          .error,
        "Invalid characters in puzzle"
      );
      done();
    });
    test("Puzzle String with Incorrect Length", (done) => {
      assert.equal(
        solver.validate(validString.substring(0, validString.length - 1)).error,
        "Expected puzzle to be 81 characters long"
      );
      done();
    });
  });
  suite("solver.checkRowPlacement(puzzleString, row, column, value)", () => {
    test("Valid Row Placement", (done) => {
      assert.isTrue(solver.checkRowPlacement(validString, 1, 1, 2));
      done();
    });
    test("Invalid Row Placement", (done) => {
      assert.isNotTrue(solver.checkRowPlacement(validString, 1, 1, 8));
      done();
    });
  });
  suite("solver.checkColPlacement(puzzleString, row, column, value)", () => {
    test("Valid Column Placement", (done) => {
      assert.isTrue(solver.checkColPlacement(validString, 4, 1, 5));
      done();
    });
    test("Invalid Column Placement", (done) => {
      assert.isNotTrue(solver.checkColPlacement(validString, 4, 1, 6));
      done();
    });
  });
  suite("solver.checkRegionPlacement(puzzleString, row column, value)", () => {
    test("Valid Region Placement", (done) => {
      assert.isTrue(solver.checkRegionPlacement(validString, 1, 2, 1));
      done();
    });
    test("Invalid Region Placement", (done) => {
      assert.isNotTrue(solver.checkRegionPlacement(validString, 1, 2, 7));
      done();
    });
  });
  suite("solver.solve(puzzleString)", () => {
    test("Valid String", (done) => {
      assert.isUndefined(solver.solve(validString).error);
      done();
    });
    test("Invalid String", (done) => {
      assert.equal(
        solver.solve(validString.substring(0, validString.length - 1) + "h")
          .error,
        "Invalid characters in puzzle"
      );
      done();
    });
    test("Valid String Solution", (done) => {
      assert.equal(
        solver.solve(validString),
        "218396745753284196496157832531672984649831257827549613962415378185763429374928561"
      );
      done();
    });
  });
});
