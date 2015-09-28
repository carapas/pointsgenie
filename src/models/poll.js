var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PollSchema = new Schema({
  name: { type: String, required: "{PATH} est requis", trim: true },
  isClosed: { type: Boolean, default: false },
  answers: [{ type: String, trim: true}],
}, {
  toObject: { virtuals: true },
  toJSON : {
    transform: function (doc, ret, options) {
      ret.id = doc.id;
      ret._id = undefined;
      return ret;
    }
  }
});
// Add a toString method or w/e

// Model creation
mongoose.model("Poll", PollSchema);
