import Model from "./Model";

class Poll extends Model {
  static schema = {
    id: { type: String },
    name: { type: String },
    answers: [{ type: String }],
    isClosed: { type: Boolean }
  };
}

export default Poll;
