import React, { useEffect, useState } from "react";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { fetchOwnImages } from "../actions";
import { OWN_IMAGES, CHILD_OVERLAY, PARENT_OVERLAY } from "../actions/types";
import ImageCard from "./partials/ImageCardOverlay";
import Alert from "react-bootstrap/Alert";
import { connect } from "react-redux";
import axios from "axios";
import history from "../history";
import { Link } from "react-router-dom";

let selectedNode = null;
const Sell = ({ fetchOwnImages, imagesNotForSale }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [creditValue, setCreditValue] = useState("");

  useEffect(() => {
    fetchOwnImages(OWN_IMAGES.QUERY_TYPE_NOT_FOR_SALE);
  }, [fetchOwnImages]);

  const renderYourImages = () => {
    if (!imagesNotForSale) {
      return "Loading...";
    } else if (imagesNotForSale.length === 0) {
      return (
        <>
          <Alert variant={"dark"}>
            You have no photos you are selling. Go to the{" "}
            <Alert.Link as={Link} to="/account">
              account
            </Alert.Link>{" "}
            page to get started!
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

  const onImageSellSubmit = async (e) => {
    e.preventDefault();
    const _id = selectedImage.slice(11, 35);
    try {
      await axios.post(
        "/api/sell",
        {
          imageId: _id,
          creditPrice: creditValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSelectedImage(null);
      fetchOwnImages(OWN_IMAGES.QUERY_TYPE_NOT_FOR_SALE);
      setCreditValue("");
    } catch (e) {
      console.error(`API /api/sell Error: ${e.message}`);
      history.push("/error");
    }
  };

  const findImageFromClick = (_id) => imagesNotForSale.find((img) => img._id === _id);

  const renderSellImagePreview = () => {
    if (!selectedImage) {
      return <Alert variant="danger">Select an image to preview</Alert>;
    }

    const _id = selectedImage.slice(11, 35);
    const foundImg = findImageFromClick(_id);

    return (
      <Card style={{ width: "100%" }}>
        <Card.Img variant="top" src={selectedImage} />
        <Card.Body>
          <Card.Text style={{ color: "#000" }}>{foundImg.caption}</Card.Text>
          <Form onSubmit={onImageSellSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
              <Col sm="12">
                <Form.Control
                  value={creditValue}
                  onChange={(e) => setCreditValue(e.target.value)}
                  min={1}
                  type="number"
                  placeholder="Set Credit Amount"
                  required
                />
              </Col>
            </Form.Group>
            <Button type="submit" variant="success" className="btn-full-width">
              Sell Image!
            </Button>
          </Form>
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
    <div>
      <Header />
      <Container className="sell-container">
        <Row>
          <Col md={8}>
            <h3>Your Images</h3>
            <p>Select the images you want to sell</p>
            {renderYourImages()}
          </Col>
          <Col md={4}>
            <h3>Image To Sell</h3>
            <p>Set the details of the image you want to sell</p>
            {renderSellImagePreview()}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => {
  const { ownImages: images } = state;
  return {
    imagesNotForSale: images.notForSale,
  };
};

export default connect(mapStateToProps, { fetchOwnImages })(Sell);
