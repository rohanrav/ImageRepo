import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import history from "../../history";
import { connect } from "react-redux";
import { signOut } from "../../actions";

const Footer = ({ isLoggedIn, anchorBottom, displayInfoText, signOut }) => {
  let leftColWidth = 8;
  let headerStyle = {};
  let logoStyle = {};

  if (!isLoggedIn) {
    leftColWidth = 12;
    headerStyle = { textAlign: "center" };
    logoStyle = { marginRight: "0" };
  }

  return (
    <div
      className={`footer-container ${anchorBottom && "footer-anchor"} ${
        !displayInfoText && "display-info-text"
      }`}
    >
      <Container>
        <Row>
          <Col sm={leftColWidth}>
            <Row>
              <Link style={headerStyle} to="/home" id="logo-title">
                <Navbar.Brand style={logoStyle} className="footer-logo">
                  ImageRepo
                </Navbar.Brand>
              </Link>
              <Col style={headerStyle} className="footer-copyright">{`© ${new Date().getFullYear()}`}</Col>
            </Row>
            {displayInfoText && (
              <Row>
                <Col style={headerStyle}>
                  ImageRepo is the easiest way to buy and sell your favourite photographs! Use our AI powered
                  search bar to find specfic images or browse our home page casually. Add credits to your
                  account or upload an image to get started today.
                </Col>
              </Row>
            )}
          </Col>
          {isLoggedIn && (
            <>
              <Col sm={2} className="footer-links-col">
                <Nav className="flex-column footer-nav">
                  <Nav.Link onClick={() => history.push("/home")}>Home</Nav.Link>
                  <Nav.Link onClick={() => history.push("/account")}>Account</Nav.Link>
                  <Nav.Link onClick={() => signOut()}>Log Out</Nav.Link>
                </Nav>
              </Col>
              <Col sm={2} className="footer-links-col">
                <Nav className="flex-column footer-nav">
                  <Nav.Link onClick={() => history.push("/feed")}>Feed</Nav.Link>
                  <Nav.Link onClick={() => history.push("/sell")}>Sell Image</Nav.Link>
                  <Nav.Link onClick={() => history.push("/search")}>Search</Nav.Link>
                </Nav>
              </Col>
            </>
          )}
        </Row>
      </Container>
    </div>
  );
};

Footer.defaultProps = {
  isLoggedIn: true,
  anchorBottom: false,
  displayInfoText: true,
};

export default connect(null, { signOut })(Footer);
