import React from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

const BaseError = ({ errorTitle, errorDescription, btnText, btnHref, btnVariant }) => {
  return (
    <div className="login-main">
      <Header isLoggedIn={false} />
      <Container>
        <Row>
          <Col md={12}>
            <div className="login-info">
              <h3 className="error-logo">{errorTitle}</h3>
              <h4>{errorDescription}</h4>
              <Button as={Link} size="lg" to={btnHref} variant={btnVariant}>
                {btnText}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer isLoggedIn={false} anchorBottom={true} displayInfoText={false} />
    </div>
  );
};

BaseError.defaultProps = {
  errorTitle: "Error",
  errorDescription: "There has been an error!",
  btnText: "Login",
  btnHref: "/login",
  btnVariant: "secondary",
};

export default BaseError;
