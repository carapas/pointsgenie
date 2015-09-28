import React, { PropTypes } from "react";
import { Panel, Button, Input, Row, Col, ProgressBar } from "react-bootstrap";

var data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
      fillColor: "rgba(220,220,220,0.5)",
      strokeColor: "rgba(220,220,220,0.8)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: [65, 59, 80, 81, 56, 55, 40]
    },
    {
      label: "My Second dataset",
      fillColor: "rgba(151,187,205,0.5)",
      strokeColor: "rgba(151,187,205,0.8)",
      highlightFill: "rgba(151,187,205,0.75)",
      highlightStroke: "rgba(151,187,205,1)",
      data: [28, 48, 40, 19, 86, 27, 90]
    }
  ]
};

const ComponentPollList = React.createClass({
  displayName: "ComponentPollList",

  propTypes: {
    polls: PropTypes.array,
    addAnswerCallback: PropTypes.func
  },

  renderPanelTitle(title) {
    return(<h3>{title}</h3>)
  },

  renderAnswers(answers) {
    return answers.map((answer) => {
      return (<Row><Col xs={6} md={4}>{answer}</Col><Col xs={8} md={6}><ProgressBar striped bsStyle="success" now={40} /></Col><Col xs={4} md={2}><Input type="checkbox"></Input></Col></Row>)
    });
  },

  getInitialState: function() {
    return {};
  },

  renderAdd(id) {
    if (!this.state[id] || !this.state[id].isAddAnswer) {
      return (<Button onClick={this.handleAddClick.bind(this, id)}>Ajouter une réponse</Button>);
    } else {
      return (<Row><Col xs={12} md={8}><Input type="text" ref={id}></Input></Col><Col xs={6} md={4}><Button onClick={this.handleAddAnswerClick.bind(this, id)}>Ajouter la réponse</Button></Col></Row>);
    }
  },

  handleAddClick(id) {
    let json = {};
    json[id] = {isAddAnswer: true};
    this.setState(json);
  },

  handleAddAnswerClick(id) {
    if (this.refs[id].getValue() === "" || this.refs[id].getValue() === undefined) {
      return;
    }

    let json = {};
    json[id] = {isAddAnswer: false};
    let selectPoll = null;
    this.props.polls.map(poll => {
      if (poll.id === id) {
        poll.answers.push(this.refs[id].getValue());
        selectPoll = poll;
      }
    });
    if (selectPoll != null) {
      this.setState(json);
      this.props.addAnswerCallback(selectPoll);
    }
  },

  renderPollList() {
    if(this.props.polls.length === 0) {
      return (<h5>Aucun Sondage</h5>);
    } else {
      return this.props.polls.map((poll) => {
        return (<Panel key={poll.id} header={this.renderPanelTitle(poll.name)} bsStyle='success'>
                  {this.renderAnswers(poll.answers)}
                  <div>{this.renderAdd(poll.id)}</div>
                </Panel>);
      });
    }
  },

  render() {
    return (
      <div>
        {this.renderPollList()}
      </div>);
  }
});

export default ComponentPollList;