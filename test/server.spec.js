const server = require("../server.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

describe("Server!", () => {    
    it("Loads home page properly", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.clientError).to.equals(false);
          expect(res.serverError).to.equals(false);
          expect(res.error).to.equals(false);
          done();
        });
    });

    it("meal search working", (done) => {
      chai
        .request(server)
        .post("/get_feed")
        .send({
            title: 'pancake'
        })
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.request._data.title).to.equal('pancake');
            expect(res.error).to.equals(false);  
            done();
        });
    });


  });