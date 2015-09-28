var mongoose = require('mongoose');
const Poll = mongoose.model("Poll");

export default {
  fetchAllPolls() {
    return Poll.find({isClosed: false}).exec().then(polls => {
      return polls
    });
  }
};
