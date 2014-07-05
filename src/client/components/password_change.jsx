/** @jsx React.DOM */
"use strict";
var React = require("react");
var Input = require("react-bootstrap/Input");
var Button = require("react-bootstrap/Button");
var Alert = require("react-bootstrap/Alert");
var request = require("../middlewares/request");

module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  validatePassword: function () {
    var pw1 = this.refs.new_pw1.getValue();
    var pw2 = this.refs.new_pw2.getValue();
    if (pw1 === "" && pw2 === "") {
      this.setState({newBsStyle: undefined});
    } else if (pw1 === pw2) {
      this.setState({newBsStyle: "success"});
    } else {
      this.setState({newBsStyle: "error"});
    }
  },
  handleSubmit: function () {
    var refs = this.refs;
    var formData = {};
    Object.keys(this.refs).forEach(function (key) {
      formData[key] = refs[key].getValue();
    });
    request.post("/user/me/password", formData, function (err, res) {
      if (err) {
        return this.setState({alert: {style: "danger", message: err.message} });
      }
      if (res.status === 200) {
        return this.setState({alert: {style: "success", message: "Changement effectué!"} });
      } else {
        return this.setState({alert: {style: "danger", message: res.body.error}});
      }
    }.bind(this));
    return false;
  },
  handleChange: function (e) {
    this.validatePassword();
  },
  handleAlertDismiss: function (e) {
    this.setState({alert: undefined});
  },
  renderMessage: function () {
    if(this.state.alert) {
      return (
        <Alert bsStyle={this.state.alert.style} onDismiss={this.handleAlertDismiss}>
          {this.state.alert.message}
        </Alert>
      );
    }
    return null;
  },
  renderOldPassword: function () {
    if(this.props.hasPassword) {
      return (
          <Input
            type="password" label="Mot de passe actuel:"
            labelClassName="col-md-3" wrapperClassName="col-md-6"
            ref="curr_pw" placeholder="actuel"
            onChange={this.handleChange}
          />
      );
    }
    return (
      <Input type="static" label="Mot de passe actuel:"
        labelClassName="col-md-3" wrapperClassName="col-md-6"
        value="Vous n'avez pas encore de mot de passe"
      />
    );
  },
  renderSubmitButton: function () {
    var text = "Changer mot de passe";
    if(this.state.newBsStyle === "error") {
      return (<Button type="submit" disabled bsStyle="success">{text}</Button>);
    }
    return (<Button type="submit" bsStyle="success">{text}</Button>);
  },
  render: function () {
    return (
      <div className="user-password-change">
        <h4>Changer de mot de passe</h4>
        {this.renderMessage()}
        <form onSubmit={this.handleSubmit} className="form-horizontal" role="form">
          <fieldset>
          {this.renderOldPassword()}
          <Input
            type="password" label="Nouveau mot de passe:"
            labelClassName="col-md-3" wrapperClassName="col-md-6"
            ref="new_pw1" placeholder="nouveau"
            onChange={this.handleChange}
          />
          <Input
            type="password" label="Répéter mot de passe:"
            labelClassName="col-md-3" wrapperClassName="col-md-6"
            ref="new_pw2" placeholder="répéter" bsStyle={this.state.newBsStyle}
            onChange={this.handleChange}
          />
          {this.renderSubmitButton()}
          </fieldset>
        </form>
      </div>
    );
  }
});
