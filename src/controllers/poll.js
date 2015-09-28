var mongoose = require('mongoose');
import _ from "lodash";
const Poll = mongoose.model("Poll");

export default {
  getUpcommingPolls: function *() {
    const polls = yield Poll.find({isClosed: false}).exec();
    this.body = { polls: polls };
  },

  create: function *() {
    if (!this.request.body) {
      this.throw("Le corps de la requête est vide", 400);
    }
    if (!this.request.body.poll) {
      this.throw("Le corps doit contenir un événement", 400);
    }
    var poll = new Poll(this.request.body.poll);

    yield poll.save();
    this.body = { poll: poll };
  },

  read: function *() {
    const { id } = this.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      this.throw("Le sondage n'existe pas", 404);
    }
    const poll = yield Poll.findById(id).exec();
    if (!poll) {
      this.throw("Le sondage n'existe pas", 404);
    }
    this.body = { poll };
  },

  update: function *() {
    if (!this.request.body) {
      this.throw("Le corps de la requête est vide", 400);
    }
    if (!this.request.body.poll) {
      this.throw("Le corps doit contenir un sondage", 400);
    }
    const { id } = this.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      this.throw("Le sondage n'existe pas", 404);
    }
    let poll = yield Poll.findById(id).exec();
    if (!poll) {
      this.throw("Le sondage n'existe pas", 404);
    }
    _.extend(poll, this.request.body.poll);
    yield poll.save();
    this.body = { poll };
  }
};
