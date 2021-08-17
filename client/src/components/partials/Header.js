import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import history from "../../history";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../actions";

const Header = ({ isLoggedIn, signOut }) => {
  const [term, setTerm] = useState("");

  return (
    <Navbar collapseOnSelect sticky="top" expand="lg" bg="light" variant="light">
      <Container>
        <Link to="/home" id="logo-title">
          <Navbar.Brand>ImageRepo</Navbar.Brand>
        </Link>
        {isLoggedIn && (
          <>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Button as={Link} to="/sell" variant="outline-secondary">
                  Sell Image
                </Button>
                <Button as={Link} to="/feed" variant="outline-secondary">
                  Feed
                </Button>
                <Button as={Link} to="/account" variant="outline-secondary">
                  Account
                </Button>
              </Nav>
              <Nav>
                <Form className="d-flex" autoComplete="off">
                  <FormControl
                    type="search"
                    name="imageSearch"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search"
                    className="mr-2"
                    aria-label="Search"
                  />
                  <Button as={Link} to={`/search?q=${term}`} variant="primary">
                    Search
                  </Button>
                </Form>
                <Button onClick={() => signOut()} variant="danger">
                  Log Out
                </Button>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

Header.defaultProps = {
  isLoggedIn: true,
};

export default connect(null, { signOut })(Header);
