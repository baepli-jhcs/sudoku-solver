const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  let validString =
    "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1";
  suite("POST /api/solve => object", () => {
    test("Valid Puzzle String", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: validString,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.solution,
            "218396745753284196496157832531672984649831257827549613962415378185763429374928561"
          );
          done();
        });
    });
    test("Missing Puzzle String", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });
    test("Invalid Character Puzzle String", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validString.substring(0, 80) + "h" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    test("Incorrect Length Puzzle String", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validString.substring(0, 80) })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    test("Unsolvable Puzzle String", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: validString.substring(0, 80) + "2" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });
  suite("POST /api/check => object", () => {
    test("Valid Puzzle Placement", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validString, coordinate: "A1", value: "2" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isTrue(res.body.valid);
          done();
        });
    });
    test("Single Placement Conflict", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validString, coordinate: "A1", value: "3" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict[0], "row");
          done();
        });
    });
    test("Multiple Placement Conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validString, coordinate: "A1", value: 4 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 2);
          done();
        });
    });
    test("All Placement Conflicts", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validString, coordinate: "A1", value: 7 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.conflict.length, 3);
          done();
        });
    });
    test("Missing Required Fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });
    test("Invalid Puzzle String", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validString.substring(0, 80) + "h",
          coordinate: "A1",
          value: 2,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });
    test("Incorrect Character Length", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: validString.substring(0, 80),
          coordinate: "A1",
          value: 2,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });
    test("Invalid Placement Coordinate", (done) => {
      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: validString, coordinate: "M1", value: 2 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });
    test("Invalid Placement Value", (done) => {
        chai.request(server).post("/api/check").send({
            puzzle: validString, coordinate: "A1", value: "H"
        }).end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, "Invalid value");
            done();
        })
    })
  });
});
