import React, { useEffect, useState } from "react";

import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut, fetchUserData } from "../actions";

const Account = ({ signOut, fetchUserData, fullName, email, credits }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState();

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const postImage = async ({ image, caption }) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    const res = await axios.post("/api/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  const onUploadFormSubmit = async (e) => {
    e.preventDefault();
    const res = await postImage({ image: file, caption });
    console.log(res);
    // call request to update images from api
  };

  const renderCreditsInfo = () => {
    // on load, render placeholder
    return (
      <>
        <h5>{`Current Number of Credits: ${credits}`}</h5>
        <Button variant="success" className="btn-full-width">
          Add Credits
        </Button>
      </>
    );
  };

  const renderAccountSettings = () => {
    // on load, render placeholder
    return (
      <>
        <h5>{`Name: ${fullName}`}</h5>
        <h5>{`Email: ${email}`}</h5>
        <Button as={Link} to="/feed" variant="primary" className="btn-full-width">
          Feed
        </Button>
        <Button
          onClick={() => signOut()}
          variant="danger"
          className="btn-full-width"
          style={{ marginTop: "7.5px" }}
        >
          Log Out
        </Button>
      </>
    );
  };

  const renderYourImages = () => {
    return (
      <>
        <Alert variant={"dark"}>
          You have no photos you own. Upload photos using the form above to get started storing your
          images on ImageRepo!
        </Alert>
      </>
    );
  };

  const renderImagesForSale = () => {
    return (
      <>
        <Alert variant="dark">
          You have no photos you are selling. Go to the{" "}
          <Alert.Link as={Link} to="/sell">
            sell images
          </Alert.Link>{" "}
          page to get started!
        </Alert>
      </>
    );
  };

  const renderImagePreview = () => {
    return (
      <>
        <Alert variant="danger">No Image Preview Available.</Alert>
      </>
    );
  };

  return (
    <>
      <Header />
      <Container className="account-container">
        <Row>
          <Col md>
            <h3>Add Image</h3>
            <Form onSubmit={onUploadFormSubmit}>
              <Form.Group className="mb-3" controlId="caption">
                <Form.Control
                  type="text"
                  placeholder="Caption"
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </Form.Group>
              <Button variant="primary" className="btn-full-width" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
          <Col md>
            <h3>Credits</h3>
            {renderCreditsInfo()}
            {/* <img height="100px" src="/api/image/611b39934cbbe5319e7227bf" /> */}
          </Col>
          <Col md>
            <h3>Account Settings</h3>
            {renderAccountSettings()}
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <h3>Your Images</h3>
            <p>The images you own but are not selling.</p>
            {renderYourImages()}
            <h3>Images For Sale</h3>
            <p>The images you are selling.</p>
            {renderImagesForSale()}
          </Col>
          <Col md={4}>
            <h3>Image Preview</h3>
            <p>Click the images on the left to preview them.</p>
            {renderImagePreview()}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

const mapStateToProps = (state) => {
  const { userProfile: user } = state;
  return {
    fullName: `${user?.givenName} ${user?.familyName}`,
    email: user?.email,
    credits: user?.credits,
  };
};

export default connect(mapStateToProps, { signOut, fetchUserData })(Account);
