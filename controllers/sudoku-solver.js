class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length != 81)
      return { error: "Expected puzzle to be 81 characters long" };
    if (/[^\d\.]/.test(puzzleString))
      return { error: "Invalid characters in puzzle" };
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.split(/(.........)/g).filter((s) => s);
    for (let i = 0; i < rows[row - 1].length; i++) {
      if (column - 1 == i) continue;
      if (value == rows[row - 1][i]) return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.split(/(.........)/g).filter((s) => s);
    for (let i = 0; i < rows.length; i++) {
      if (row - 1 == i) continue;
      if (rows[i][column - 1] == value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.split(/(.........)/g).filter((s) => s);
    let lockCol = this.lockNumber(column);
    let lockRow = this.lockNumber(row);
    for (let i = lockRow; i < 3 + lockRow; i++) {
      for (let j = lockCol; j < lockCol + 3; j++) {
        if (row == i && column == j) continue;
        if (rows[i - 1][j - 1] == value) return false;
      }
    }
    return true;
  }
  lockNumber(number) {
    if (number == 1 || number == 2 || number == 3) return 1;
    if (number == 4 || number == 5 || number == 6) return 4;
    if (number == 7 || number == 8 || number == 9) return 7;
  }
  solve(puzzleString) {
    const validated = this.validate(puzzleString);
    if (validated !== true) return validated;
    let newString = puzzleString;
    let skippedNumbers = [];
    for (let i = 0; i < newString.length; i++) {
      skippedNumbers.push(i);
    }
    while (skippedNumbers.length > 0) {
      let tempNumbers = skippedNumbers;
      skippedNumbers = [];
      for (let key = 0; key < tempNumbers.length; key++) {
        let i = tempNumbers[key];
        let row = Math.ceil((i + 1) / 9);
        let col = Math.ceil((i + 1) % 9);
        if (col == 0) col = 9;
        if (row == 0) row = 9;
        if (newString[i] != ".") {
          if (!this.checkAll(newString, row, col, newString[i])) {
            console.log(row + " and " + col);
            return { error: "Puzzle cannot be solved" };
          }
          continue;
        }
        let number;
        let found = false;
        let skip;
        for (let j = 1; j < 10; j++) {
          if (this.checkAll(newString, row, col, j)) {
            if (!found) {
              found = true;
              number = j;
              continue;
            }
            skip = i;
          }
          if (j == 9 && !found) return { error: "Puzzle cannot be solved" };
        }
        if (skip !== undefined) {
          skippedNumbers.push(skip);
          continue;
        } else {
          let stringArray = newString.split("");
          stringArray[i] = number;
          newString = stringArray.join("");
        }
      }
    }
    return newString;
  }
  checkAll(str, chr, row, col) {
    return (
      this.checkColPlacement(str, chr, row, col) &&
      this.checkRowPlacement(str, chr, row, col) &&
      this.checkRegionPlacement(str, chr, row, col)
    );
  }
}
module.exports = SudokuSolver;
