"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");
const express = require("express");
module.exports = function (app) {
  let solver = new SudokuSolver();

  app
    .route("/api/check")
    .post(express.urlencoded({ extended: false }), (req, res) => {
      let puzzleString = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = (req.body.value);
      if (!puzzleString || !coordinate || !value)
        return res.json({ error: "Required field(s) missing" });
      value = parseInt(value);
      if (!value || value > 9 || value < 1) return res.json({ error: "Invalid value" });
      let col = parseInt(coordinate[1]);
      if (col > 9 || col < 1) return res.json({ error: "Invalid coordinate" });
      let row;
      switch (coordinate[0]) {
        case "A":
          row = 1;
          break;
        case "B":
          row = 2;
          break;
        case "C":
          row = 3;
          break;
        case "D":
          row = 4;
          break;
        case "E":
          row = 5;
          break;
        case "F":
          row = 6;
          break;
        case "G":
          row = 7;
          break;
        case "H":
          row = 8;
          break;
        case "I":
          row = 9;
          break;
        default:
          return res.json({ error: "Invalid coordinate" });
      }
      const validated = solver.validate(puzzleString);
      if (validated !== true) return res.json(validated);
      let conflict = [];
      if (!solver.checkRowPlacement(puzzleString, row, col, value))
        conflict.push("row");
      if (!solver.checkColPlacement(puzzleString, row, col, value))
        conflict.push("column");
      if (!solver.checkRegionPlacement(puzzleString, row, col, value))
        conflict.push("region");
      if (conflict.length > 0) return res.json({ valid: false, conflict });
      res.json({ valid: true });
    });

  app
    .route("/api/solve")
    .post(express.urlencoded({ extended: false }), (req, res) => {
      if (!req.body.puzzle)
        return res.json({ error: "Required field missing" });
      let solved = solver.solve(req.body.puzzle);
      if (solved.error) return res.json(solved);
      res.json({ solution: solved });
    });
};
