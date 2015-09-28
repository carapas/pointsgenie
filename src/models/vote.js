var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VoteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User"},
  poll: { type: Schema.Types.ObjectId, ref: "Poll" },
  answer: { type: String, trim: true }
},{
  toObject: { virtuals: true },
  toJSON : {
    transform: function (doc, ret, options) {
      ret.id = doc.id;
      ret._id = undefined;
      ret.__v = undefined;
      return ret;
    }
  }
});

VoteSchema.index({ user: 1, poll: 1 }, { unique: true });

// Model creation
mongoose.model("Vote", VoteSchema);
