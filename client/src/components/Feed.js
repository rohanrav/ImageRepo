import React, { useEffect } from "react";
import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

import { connect } from "react-redux";
import { fetchPurchaseHistory } from "../actions";
import history from "../history";

const Feed = ({ fetchPurchaseHistory, purchaseHistory }) => {
  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const formatCaption = (caption, num = 80) => {
    if (caption.length > num) {
      return `${caption.slice(0, num)}...`;
    }

    return caption;
  };

  const renderHistoryList = () => {
    if (!purchaseHistory) {
      return <div>Loading...</div>;
    } else if (purchaseHistory.length === 0) {
      return <Alert variant={"dark"}>Purchase or buy an image to get started.</Alert>;
    }

    return purchaseHistory.map((hist, index) => (
      <Row
        style={{
          margin: "20px 0",
          padding: "30px",
          backgroundColor: "#f7f7f7",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
        key={index}
      >
        <Col md style={{ textAlign: "center" }}>
          <img
            width="70%"
            height="350px"
            style={{ objectFit: "cover", borderRadius: "5px" }}
            src={`/api/image/${hist.imageKey}`}
          />
        </Col>
        <Col md>
          <Card style={{ margin: "auto", width: "100%", height: "350px" }}>
            <Card.Header>Item #{index + 1}</Card.Header>
            <Card.Body style={{ paddingBottom: "0px" }}>
              <Table striped bordered hover responsive="md" variant="light">
                <tbody>
                  <tr>
                    <td>Purchase Type</td>
                    <td>{hist.purchaseType}</td>
                  </tr>
                  <tr>
                    <td>Credits</td>
                    <td>{hist.price}</td>
                  </tr>
                  <tr>
                    <td>Caption</td>
                    <td>{formatCaption(hist.caption)}</td>
                  </tr>
                  <tr>
                    <td>Date</td>
                    <td>{hist.timeText}</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
              <Button
                onClick={() => history.push("/account")}
                className="btn-full-width"
                variant="primary"
              >
                See your account
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    ));
  };

  return (
    <>
      <Header />
      <Container className="container-padding">
        <Row>
          <h3>Your Feed</h3>
          <p>See the images you purchased and sold!</p>
        </Row>
        {renderHistoryList()}
      </Container>
      <Footer />
    </>
  );
};

const mapStateToProps = ({ purchaseHistory }) => {
  return { purchaseHistory };
};

export default connect(mapStateToProps, { fetchPurchaseHistory })(Feed);
