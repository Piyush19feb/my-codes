import React, { Component } from "react";
import Modal from "./modal.js";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <main>
        <h4>Features Window</h4>
        <div>
          <h6>
            React Modal <b onClick={this.showModal}>[ Click Here ! ]</b>
          </h6>
          <Modal show={this.state.show} handleClose={this.hideModal}>
            <p>Modal</p>
          </Modal>
        </div>
      </main>
    );
  }
}

export default Dashboard;
