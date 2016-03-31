"use strict";
import React, { PropTypes } from "react";
import { Input, Col, Row, Button } from "react-bootstrap";
import Select from "react-select"
import _ from "lodash";

import dateHelper from "../../middlewares/date";

const MatchToEventForm = React.createClass({
  displayName: "MatchToEventForm",
  propTypes: {
    onSubmit: PropTypes.func.isRequired,
    getHourTaskUserList: PropTypes.func,
    event: PropTypes.shape({
      name: PropTypes.string,
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
      tasks: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    isSubmitting: PropTypes.bool,
  },

  getInitialState() {
    let hours = {};
    let tasks = {};
    let currDate = dateHelper.clone(this.props.event.startDate);
    while(currDate.getTime() < this.props.event.endDate.getTime()) {
      let time = currDate.getTime();
      hours[time] = [];
      tasks[time] = {};
      for(let task of this.props.event.tasks) {
        tasks[time][task] = [];
      }
      currDate = dateHelper.addHours(currDate, 1);
    }

    return {
      hoursSelected: hours,
      tasksSelected: tasks
    };
  },

  getFormData() {
    return this.state.tasksSelected;
  },

  onSelectBoxChange(ref, val, array) {
    let index = ref.indexOf("-");
    let time = ref.substring(0, index);
    let task = ref.substring(index + 1);
    let hoursSelected = this.state.hoursSelected;
    let tasksSelected = this.state.tasksSelected;
    let newSelected;
    if(val.length > 0) {
      newSelected = val.split(',');
    } else {
      newSelected = [];
    }

    if(this.state.tasksSelected[time][task].length > newSelected.length)
    {
      let diff = _.difference(this.state.tasksSelected[time][task], newSelected);
      for(let value of diff) {
        let idx = hoursSelected[time].indexOf(value);
        hoursSelected[time].splice(idx, 1);
      }
    } else {
      let diff = _.difference(newSelected, this.state.tasksSelected[time][task]);
      for(let value of diff) {
        hoursSelected[time].push(value);
      }
    }

    tasksSelected[time] = tasksSelected[time];
    tasksSelected[time][task] = newSelected;
    this.setState({hoursSelected: hoursSelected, tasksSelected: tasksSelected});
  },

  renderSelectBox(task, users, time, className) {
    let options = users.map((user, index) => {
      return {value: user.id, label: `${user.totalPoints || 0} - ${user.name || user.cip} (${user.preferenceClassName})`, disabled: this.state.hoursSelected[time] && this.state.hoursSelected[time].indexOf(user.id) > -1};
    });

    let values = this.state.tasksSelected[time][task];
    let numPeople = 0;
    if (this.refs[`${time}${task}`]) {
      numPeople = this.refs[`${time}${task}`].getValue();
    }

    let color = '';
    if (numPeople > values.length) {
      color = 'rgb(200, 20, 20)';
    } else if (numPeople < values.length) {
      color = 'rgb(200, 200, 20)';
    } else {
      color = 'rgb(20, 200, 20)';
    }

    let style = {};
    if (numPeople != ''){
      style = {border: `1px solid ${color}`, boxShadow: `0px 1px 3px rgba(0, 0, 0, 0.05) inset, 0px 0px 8px ${color}`};
    }

    return (
      <Col xs={6} md={6} key={task}>
        <Row>
          <Col xs={6} md={6}>
            <h3>{task}</h3>
          </Col>
          <Col xs={6} md={6}>
            <Input style={{marginTop: "15px", ...style}} ref={`${time}${task}`} onChange={x => {this.setState({});}} type="number" placeholder="Nombre de bénévoles" />
          </Col>
        </Row>
        <Select
          multi
          value={values}
          name="form-field-name"
          options={options}
          ref={time + "-" + task}
          onChange={this.onSelectBoxChange.bind(this, time + "-" + task)}
          noResultsText="Aucune application"
          menuBuffer={1000}
          className={className}
        />
      </Col>
    );
  },

  renderHours() {
    let tasks = this.props.event.tasks;
    let currDate = dateHelper.clone(this.props.event.startDate);
    let rows = [];
    while(currDate.getTime() < this.props.event.endDate.getTime()) {
      let key = currDate.getTime();
      let row = [];
      let cur = [];
      for (let i = 0; i < tasks.length; ++i) {
        let users = this.props.getHourTaskUserList(currDate.toISOString(), tasks[i]);
        let nextDate = dateHelper.addHours(dateHelper.clone(currDate), 1);
        let className = undefined;
        if(nextDate >= this.props.event.endDate.getTime() && i >= tasks.length - (2-tasks.length%2)) {
          className = "Last-row";
        }
        cur.push(this.renderSelectBox(tasks[i], users, key, className));
        if(cur.length > 1) {
          row.push(<Row>{cur}</Row>);
          cur = [];
        }
      }

      if(cur.length > 0) {
        row.push(<Row>{cur}</Row>);
      }
      rows.push(
        <Input key={currDate.getTime()} label={currDate.toLocaleString()} wrapperClassName="wrapper">
          {row}
        </Input>
      );

      // Get next hour
      currDate = dateHelper.addHours(currDate, 1);
    }
    return rows;
  },

  renderSubmitButton() {
    return (
      <Button type="submit" disabled={this.props.isSubmitting} bsStyle="success">
        { this.props.isSubmitting ? "En cours...": "Attribuer les tâches" }
      </Button>
    );
  },

  render() {
    return (
      <form onSubmit={this.props.onSubmit} role="form">
        {this.renderHours()}
        {this.renderSubmitButton()}
        <span className="help-block">
          Notez qu'attribuer les postes fermera l'événement. Il ne sera plus possible d'y postuler.
        </span>
      </form>
    );
  }
});

export default MatchToEventForm;
