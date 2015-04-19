"use strict";
var React = require("react");
var PropTypes = React.PropTypes;
var Input = require("react-bootstrap/Input");
var Alert = require("react-bootstrap/Alert");
var ApplicationForm = require("./form");

module.exports = React.createClass({
  displayName: "ApplyToEventWrapper",
  propTypes: {
    eventList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        startDate: PropTypes.instanceOf(Date).isRequired,
        endDate: PropTypes.instanceOf(Date).isRequired,
        tasks: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
    onFormSubmit: PropTypes.func.isRequired,
    onAlertDismiss: PropTypes.func.isRequired,
  },
  getInitialState: function () {
    return {
      selectedEventIndex: 0,
      isFormValid: false,
    };
  },
  isValid: function () {
    return this.state.isFormValid;
  },
  getFormData: function () {
    return this.refs.applicationForm.getFormData();
  },
  handleFormChange: function () {
    this.setState({ isFormValid: this.refs.applicationForm.isValid() });
  },
  handleDropdownChange : function () {
    if (this.props.eventList.length === 0) {
      return;
    }
    this.setState({ selectedEventIndex: this.refs.eventSelect.getDOMNode().value});
  },
  getSelectedEvent: function () {
    var index = this.state.selectedEventIndex > this.props.eventList.length ?
      0 : this.state.selectedEventIndex;
    return this.props.eventList[index];
  },
  renderMessage: function () {
    if (this.props.alert) {
      return (
        <Alert bsStyle={this.props.alert.style} onDismiss={this.props.onAlertDismiss}>
          {this.props.alert.message}
        </Alert>
      );
    }
    return null;
  },
  renderEventList: function () {
    if (this.props.eventList.length === 0) {
      return (<p>Il n'y a aucun événement de prévu sur lequel vous n'avez pas déjà postulé.</p>);
    }
    var options = this.props.eventList.map(function (entry, index) {
      return (
        <option value={index} key={entry.id}>
          {entry.name} ({entry.startDate.toLocaleDateString()})
        </option>
      );
    });
    return (
      <span>Postuler pour
        <select ref="eventSelect" type="select" onChange={this.handleDropdownChange}
          className="form-control application-event-selector" value={this.state.selectedEventIndex}
        >
          {options}
        </select>
      </span>
    );
  },
  renderForm: function () {
    if(this.props.eventList.length === 0) {
      return (null);
    }
    var event = this.getSelectedEvent();

    return (
      <ApplicationForm ref="applicationForm" key={event.id}
        startDate={event.startDate} endDate={event.endDate} tasks={event.tasks}
        isSubmitting={this.props.isFormSubmitting} isValid={this.state.isFormValid}
        onChange={this.handleFormChange} onSubmit={this.props.onFormSubmit}
      />
    );
  },
  render: function() {
    return (
      <div className="apply-event">
        <h3>Postuler pour un événement</h3>
        {this.renderMessage()}
        {this.renderEventList()}
        {this.renderForm()}
      </div>
    );
  }
});