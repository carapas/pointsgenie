/** @jsx React.DOM */
"use strict";
var React = require("react");
var Input = require("react-bootstrap/Input");

module.exports = React.createClass({
  inner: function () {
    if(this.props.promocard.price) {
      return (
        <form className="form-horizontal">
          <fieldset>
            <Input type="static" label="Prix payé:" labelClassName="col-md-3" wrapperClassName="col-md-6" value={this.props.promocard.price} />
            <Input type="static" label="Date:" labelClassName="col-md-3" wrapperClassName="col-md-6" value={this.props.promocard.created} />
          </fieldset>
        </form>
      );
    }
    return (<p> La promocarte n'a pas été achetée encore</p>);
  },
  render: function() {
    return (
      <div className="user-promocard-info">
        <h4>Promocarte</h4>
        {this.inner()}
      </div>
    );
  }
})