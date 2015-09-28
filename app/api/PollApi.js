import request from "superagent";
import ResourceApi from "./ResourceApi";
import Poll from "../models/Poll";

class PollApi extends ResourceApi {
  static resourceUrl = "polls";
  static resourceName = {
    singular: "poll",
    plural: "polls"
  };
  static Resource = Poll;

};

export default PollApi;
