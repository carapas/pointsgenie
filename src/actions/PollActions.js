import { Actions } from "flummox";
import PollApi from "../api/PollApi";

function pollActionsFactory({ koaContext }) {
  class PollActions extends Actions {
    async fetchAllPolls() {
      return await null;
    }
  }
  return PollActions
};

export default pollActionsFactory;