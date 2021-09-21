import React from "react";
import ReactDOM from "react-dom";

import BootstrapModal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Modal = (props) => {
  return ReactDOM.createPortal(
    <BootstrapModal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <BootstrapModal.Header closeButton={!props.success}>
        <BootstrapModal.Title id="contained-modal-title-vcenter">
          {props.heading}
        </BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>{props.body}</BootstrapModal.Body>
      <BootstrapModal.Footer>
        {props.buttons}
        {!props.success && <Button onClick={props.onHide}>Close</Button>}
      </BootstrapModal.Footer>
    </BootstrapModal>,
    document.querySelector("#modal")
  );
};

export default Modal;
