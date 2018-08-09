import React, { Component } from "react";

export default class Modal extends Component {
  render() {
    const isDisabled = this.props.isFetching ? "disabled" : "";
    return (
      <div className="modal-container">
        <div className="modal">
          <div className="modal-content">
            <p>{this.props.message}</p>
          </div>
          <div className="modal-footer">
            <button
              className={`waves-effect waves-light btn red lighten-1 ${isDisabled}`}
              onClick={this.props.handler}
              type={this.props.buttonType}
            >
              Confirm
            </button>
            <a
              className="waves-effect waves-light btn-flat"
              onClick={this.props.handleModalHide}
            >
              Cancle
            </a>
          </div>
        </div>
      </div>
    );
  }
}
