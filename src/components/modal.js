import React, { Component } from "react";

export default class Modal extends Component {
  render() {
    //Disable the action button when isPending is true using materializecss' "disabled" class
    const isDisabled = this.props.isPending ? "disabled" : "";

    const {message, handler, buttonType, handleModalHide} = this.props;
    return (
      <div className="modal-container">
        <div className="modal">
          <div className="modal-content">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button
              className={`waves-effect waves-light btn red lighten-1 ${isDisabled}`}
              onClick={handler}
              type={buttonType}
            >
              Confirm
            </button>
            <a
              className="waves-effect waves-light btn-flat"
              onClick={handleModalHide}
            >
              Cancle
            </a>
          </div>
        </div>
      </div>
    );
  }
}
