import BaseStore from "./BaseStore";
import Poll from "../../app/models/Poll";


class PollStore extends BaseStore {
  static serialize = function(state) {
    return JSON.stringify(state);
  };

  static deserialize = function(state) {
    if (state) {
      let parsed = JSON.parse(state);
      if (!parsed.polls) {
        parsed.polls = {};
      }
      for (let key in parsed.polls) {
        const poll = parsed.polls[key];
        parsed.polls[key] = new Poll(poll);
      }
      return parsed;
    }
    return null;
  };

  constructor(flux) {
    super();
    const pollActions = flux.getActions("poll");
    this.register(pollActions.fetchAllPolls,
        this.handleAllPolls
    );

    this.register(pollActions.createPoll,
        this.handleSinglePoll
    );

    this.register(pollActions.updatePoll,
      this.handleSinglePoll
    );

    this.state = {polls: {},};
    this.flux = flux;
  }

  getError() {
    return this.state.error;
  }

  getAllPolls() {
    if (this.state.fetchedAllPolls) {
      return Object.keys(this.state.polls).map(id => this.state.polls[id]);
    }
    if (!this.state.isLoading) {
      this.flux.getActions("poll").fetchAllPolls();
    }

    return [];
  }

  handleAllPolls(newPolls = []) {
    let { polls } = this.state;
    newPolls.map((poll) => {
      polls[poll.id] = new Poll(poll);
    });
    this.setState({
      polls,
      fetchedAllPolls: true,
      error: null,
    });
  }

  handleSinglePoll(poll) {
    this.handleFinishAsyncRequest();
    let polls = this.state.polls;
    polls[poll.id] = poll;
    this.setState({
      polls: polls,
      fetchedAllPolls: true,
      error: null,
    });
  }
}

export default PollStore;