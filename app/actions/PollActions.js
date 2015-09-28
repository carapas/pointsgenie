import { Actions } from "flummox";
import PollApi from "../api/PollApi";

const pollApi = new PollApi();

class PollActions extends Actions {
  async fetchAllPolls() {
    return await pollApi.readAll();
  }

  async createPoll(poll) {
    return await pollApi.create(poll);
  }

  async updatePoll(poll) {
    return await pollApi.update(poll);
  }
}

export default PollActions;