import React, { useEffect, useRef, useState } from "react";

import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut, fetchUserData, fetchOwnImages, addCredits } from "../actions";
import { OWN_IMAGES, CHILD_OVERLAY, PARENT_OVERLAY } from "../actions/types";
import ImageCard from "./partials/ImageCardOverlay";
import history from "../history";
import _ from "lodash";

require("@tensorflow/tfjs-backend-cpu");
require("@tensorflow/tfjs-backend-webgl");
const cocoSsd = require("@tensorflow-models/coco-ssd");

let selectedNode = null;
const Account = ({
  signOut,
  fetchUserData,
  fetchOwnImages,
  fullName,
  email,
  credits,
  imagesForSale,
  imagesNotForSale,
  addCredits,
}) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [imageCharacteristics, setImageCharacteristics] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    fetchUserData();
    fetchOwnImages(OWN_IMAGES.QUERY_TYPE_NOT_FOR_SALE);
    fetchOwnImages(OWN_IMAGES.QUERY_TYPE_FOR_SALE);
  }, [fetchUserData, fetchOwnImages]);

  const onImageFormChange = async (e) => {
    setFormLoading(true);
    setFile(e.target.files[0]);
    const model = await cocoSsd.load();
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (e) => {
      const image = new Image();
      image.src = e.target.result;
      image.onload = async () => {
        const predictions = await model.detect(image);
        setImageCharacteristics(predictions);
        setFormLoading(false);
      };
    };
  };

  const postImage = async ({ image, caption }) => {
    console.log(_.map(_.uniqBy(imageCharacteristics, "class"), "class"));
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    formData.append(
      "characteristics",
      JSON.stringify(_.map(_.uniqBy(imageCharacteristics, "class"), "class"))
    );
    await axios.post("/api/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const onUploadFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await postImage({ image: file, caption });
      fileInputRef.current.reset();
      setCaption("");
      fetchOwnImages(OWN_IMAGES.QUERY_TYPE_NOT_FOR_SALE);
    } catch (e) {
      console.error(`Error uploading image: ${e.message}`);
    }
  };

  const renderCreditsInfo = () => {
    return (
      <>
        <h5>{`Current Number of Credits: ${credits}`}</h5>
        <Button variant="success" className="btn-full-width" onClick={addCredits}>
          Add Credits
        </Button>
      </>
    );
  };

  const renderAccountSettings = () => {
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
    if (!imagesNotForSale) {
      return "Loading...";
    } else if (imagesNotForSale.length === 0) {
      return (
        <>
          <Alert variant={"dark"}>
            You have no photos you own that you aren't selling. Upload photos using the form above
            to get started!
          </Alert>
        </>
      );
    }

    return (
      <div className="accounts-image-container">
        <div className="image-list-home">
          {imagesNotForSale.map((image) => (
            <ImageCard
              key={image._id}
              description={image.caption}
              src={`/api/image/${image._id}`}
              imageTitle={`${image.price} Credits`}
              imageDescription={image.caption}
              imageDate={image.timeText}
              navigateOnClick={false}
              customOverlayOnClick={(e) => modifyClickBorder(e)}
              showCreditPrice={false}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderImagesForSale = () => {
    if (!imagesForSale) {
      return "Loading";
    } else if (imagesForSale.length === 0) {
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
    }
    return (
      <div className="accounts-image-container">
        <div className="image-list-home">
          {imagesForSale.map((image) => {
            return (
              <ImageCard
                key={image._id}
                description={image.caption}
                src={`/api/image/${image._id}`}
                imageTitle={`${image.price} Credits`}
                imageDescription={image.caption}
                imageDate={image.timeText}
                navigateOnClick={false}
                customOverlayOnClick={(e) => modifyClickBorder(e)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const findImageFromClick = (_id) => {
    const foundImgForSale = imagesForSale.find((img) => img._id === _id);
    const foundImgNotForSale = imagesNotForSale.find((img) => img._id === _id);
    return foundImgForSale || foundImgNotForSale;
  };

  const deleteImage = async (e) => {
    try {
      await axios.delete(`/api/image/${selectedImage.slice(11, 35)}`);
      setSelectedImage(null);
      fetchOwnImages(OWN_IMAGES.QUERY_TYPE_NOT_FOR_SALE);
      fetchOwnImages(OWN_IMAGES.QUERY_TYPE_FOR_SALE);
    } catch (e) {
      console.error(`API /api/image Error: ${e.message}`);
      history.push("/error");
    }
  };

  const renderImagePreview = () => {
    if (!selectedImage) {
      return (
        <>
          <Alert variant="danger">Select an image.</Alert>
        </>
      );
    }

    const _id = selectedImage.slice(11, 35);
    const foundImg = findImageFromClick(_id);
    return (
      <Card style={{ width: "100%" }}>
        <Card.Img variant="top" src={selectedImage} />
        <Card.Body>
          {foundImg.sellImg && (
            <Card.Title style={{ color: "#000" }}>{`${foundImg.price} Credits`}</Card.Title>
          )}
          <Card.Text style={{ color: "#000" }}>{foundImg.caption}</Card.Text>
          <Button
            style={{ marginBottom: "7.5px" }}
            variant="outline-primary"
            className="btn-full-width"
            href={selectedImage}
            download
          >
            Download
          </Button>
          <Button onClick={deleteImage} variant="danger" className="btn-full-width">
            Delete
          </Button>
        </Card.Body>
      </Card>
    );
  };

  const modifyClickBorder = (e) => {
    const borderStyle = "solid #d3d3d4 7.5px";
    if (selectedNode) {
      selectedNode.style.border = "none";
      selectedNode.style.backgroundColor = "rgba(91, 91, 91, 0)";
    }

    if (e.target.id === CHILD_OVERLAY) {
      selectedNode = e.target.parentNode;
    } else if (e.target.id === PARENT_OVERLAY) {
      selectedNode = e.target;
    }
    selectedNode.style.border = borderStyle;
    selectedNode.style.backgroundColor = "rgba(91, 91, 91, 0.7)";
    setSelectedImage(selectedNode.title);
  };

  return (
    <>
      <Header />
      <Container className="account-container">
        <Row>
          <Col md>
            <h3>Add Image</h3>
            <Form ref={fileInputRef} onSubmit={onUploadFormSubmit}>
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
                  disabled={formLoading}
                  type="file"
                  accept="image/*"
                  onChange={onImageFormChange}
                  required
                />
              </Form.Group>
              <Button
                disabled={formLoading}
                variant="primary"
                className="btn-full-width"
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </Col>
          <Col md>
            <h3>Credits</h3>
            {renderCreditsInfo()}
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
  const { userProfile: user, ownImages: images } = state;
  return {
    fullName: `${user?.givenName} ${user?.familyName}`,
    email: user?.email,
    credits: user?.credits,
    imagesForSale: images.forSale,
    imagesNotForSale: images.notForSale,
  };
};

export default connect(mapStateToProps, { signOut, fetchUserData, fetchOwnImages, addCredits })(
  Account
);
