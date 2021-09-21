import React, { useEffect, useState, useRef } from "react";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "./partials/Modal";
import { fetchHomeImages } from "../actions";
import { connect } from "react-redux";
import history from "../history";

const _buttonHeight = 54;
const _minTableRowHeight = 41;

const Buy = ({ match, fetchHomeImages, homeImages }) => {
  let imageId = match.params.id;
  const [image, setImage] = useState(null);
  const [tableHeight, setTableHeight] = useState(0);
  const [modalShow, setModalShow] = useState({ show: false, success: null });
  const imageRef = useRef();

  useEffect(() => {
    fetchHomeImages();
  }, [fetchHomeImages]);

  useEffect(() => {
    const fetchImageData = async () => {
      const res = await axios.get(`/api/image-detail/${imageId}`);
      setImage(res.data);
    };
    fetchImageData();
  }, [imageId]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.addEventListener("load", (e) => setTableHeight(e.target.clientHeight));
    }
  }, [image]);

  const buyImage = async (e) => {
    try {
      const { data } = await axios.post(
        "/api/buy",
        {
          imageBeingPurchasedId: image._id,
          imageBeingPurchasedPrice: image.price,
          imageBeingPurchasedOwnerId: image.ownerUserID,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        setModalShow({ show: true, success: true });
      } else {
        setModalShow({ show: true, success: false });
      }
    } catch (e) {
      console.error(`Error buying image: ${e}`);
      setModalShow({ show: true, success: false });
    }
  };

  const renderModal = () => {
    if (!modalShow.show) {
      return;
    }

    let heading, body, success;
    let backdrop = true;
    let buttons = (
      <Button variant="success" onClick={() => history.push("/account")}>
        See your account
      </Button>
    );

    if (modalShow.success) {
      success = true;
      heading = "Success!";
      backdrop = "static";
      body = (
        <Container>
          <Row className="text-center">
            <h3 style={{ marginBottom: "15px" }}>
              <span style={{ color: "#1b7b4c" }}>Congrats!</span> You just purchased this image!
            </h3>
          </Row>
          <Row>
            <Col md={6}>{renderImage()}</Col>
            <Col md={6}>{renderImageTable(false, 300)}</Col>
          </Row>
        </Container>
      );
    } else {
      success = false;
      heading = "Failure!";
      body = (
        <Container className="text-center">
          <Row>
            <h3>
              Uh oh! An <span style={{ color: "#dc3545" }}>error</span> occured while purchasing
              this image!
            </h3>
          </Row>
          <Row>
            <p>Make sure you have enough credits to purchase this image.</p>
          </Row>
        </Container>
      );
      buttons = (
        <Button variant="danger" onClick={() => history.push("/account")}>
          Add credits
        </Button>
      );
    }

    return (
      <Modal
        backdrop={backdrop}
        heading={heading}
        body={body}
        buttons={buttons}
        show={modalShow.show}
        success={success}
        onHide={() => setModalShow({ show: false, success: null })}
      />
    );
  };

  const renderImage = () => {
    if (!image) {
      return "Loading...";
    }

    return (
      <div style={{ textAlign: "center" }}>
        <img
          ref={imageRef}
          style={{ maxHeight: "500px", maxWidth: "100%" }}
          src={`/api/image/${image._id}`}
          alt={image._id}
        />
      </div>
    );
  };

  const formatCaption = (caption, num = 150) => {
    if (caption.length > num) {
      return `${caption.slice(0, num)}...`;
    }

    return caption;
  };

  const renderImageTable = (includePurchaseButton = true, tableHeightParam = null) => {
    if (!image) {
      return "Loading...";
    }
    return (
      <>
        <Table
          style={{ height: `${tableHeightParam || tableHeight - _buttonHeight}px` }}
          striped
          bordered
          hover
          responsive="md"
          variant="light"
        >
          <thead>
            <tr>
              <th colSpan="2">Image Details</th>
            </tr>
          </thead>
          <tbody>
            <tr height={`${_minTableRowHeight}px`}>
              <th>Price</th>
              <th>{image.price} Credits</th>
            </tr>
            <tr height={`${_minTableRowHeight}px`}>
              <th>Posted</th>
              <th>{image.timeText}</th>
            </tr>
            <tr>
              <th>Caption</th>
              <th>{formatCaption(image.caption)}</th>
            </tr>
          </tbody>
        </Table>
        {includePurchaseButton && (
          <Button onClick={buyImage} variant="success" className="btn-full-width">
            Buy
          </Button>
        )}
      </>
    );
  };

  const renderMoreImages = () => {
    if (!homeImages || !image) {
      return "Loading...";
    }

    let shuffled = homeImages.sort(() => 0.5 - Math.random());
    shuffled = shuffled.slice(0, 4).filter((ele) => ele._id !== image._id);
    return shuffled.map((ele) => {
      return (
        <Col key={ele._id}>
          <Card className="btn-full-width">
            <Card.Img
              onClick={() => history.push(`/buy/${ele._id}`)}
              variant="top"
              className="cursor-pointer more-card-image"
              src={`/api/image/${ele._id}`}
            />
            <Card.Body>
              <Card.Title className="image-card-text">{ele.price} Credits</Card.Title>
              <Card.Text className="image-card-text">{formatCaption(ele.caption, 21)}</Card.Text>
              <Button
                onClick={() => history.push(`/buy/${ele._id}`)}
                className="btn-full-width cursor-pointer"
                variant="success"
              >
                View
              </Button>
            </Card.Body>
          </Card>
        </Col>
      );
    });
  };

  return (
    <div>
      {renderModal()}
      <Header />
      <Container className="buy-container">
        <Row>
          <h3>Buy Image!</h3>
          <p>See the details of this image for sale!</p>
        </Row>
        <Row>
          <Col md={7}>{renderImage()}</Col>
          <Col md={5}>{renderImageTable()}</Col>
        </Row>
        <Row className="more-images-container">
          <h4 className="more-images-header">More Images You May Like</h4>
          {renderMoreImages()}
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    homeImages: state.homeImages,
  };
};

export default connect(mapStateToProps, { fetchHomeImages })(Buy);
