import React, { PropTypes } from "react";
import { Link } from "react-router/build/npm/lib";
import connectToStore from "flummox/connect";

import PollList from "../components/poll-list";

const PollPage = React.createClass({
  displayName: "PollPage",

  contextTypes: {
    flux: PropTypes.object,
  },

  addAnswer(poll) {
    console.log(poll);
    this.context.flux.getActions("poll").updatePoll(poll);
  },

  render() {
    return (
        <div className="polls">
          <h3>Sondages</h3>
          <PollList polls={this.props.polls} addAnswerCallback={this.addAnswer} />
        </div>
    );
  }

});

const ConnectedPoll = connectToStore(PollPage, {
  poll: store => ({
    polls: store.getAllPolls(),
  })
});

export default ConnectedPoll;

