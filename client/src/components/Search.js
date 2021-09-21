import React, { useEffect, useState } from "react";

import Header from "./partials/Header";
import Footer from "./partials/Footer";
import ImageCard from "./partials/ImageCardOverlay";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { fetchImagesBySearch, fetchUserData } from "../actions";
import { connect } from "react-redux";

const Search = ({ location, fetchImagesBySearch, fetchUserData, search, userProfile }) => {
  const params = new URLSearchParams(location.search);
  const [query, setQuery] = useState(params.get("q"));

  useEffect(() => {
    fetchUserData();
    fetchImagesBySearch(query);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q"));
    fetchImagesBySearch(params.get("q"));
  }, [location.search]);

  const renderYourImagesResults = () => {
    const yourImages = search.filter((ele) => !ele.sellImg && userProfile._id === ele.ownerUserID);
    if (!search || !userProfile) {
      return "Loading...";
    } else if (yourImages.length === 0) {
      return <Alert variant={"dark"}>You have no photos you own that match this query.</Alert>;
    }

    return (
      <div className="accounts-image-container">
        <div className="image-list-home">
          {yourImages.map((image) => (
            <ImageCard
              key={image._id}
              description={image.caption}
              src={`/api/image/${image._id}`}
              imageTitle={`${image.price} Credits`}
              imageDescription={image.caption}
              imageDate={image.timeText}
              showCreditPrice={false}
              href="/account"
            />
          ))}
        </div>
      </div>
    );
  };

  const renderImagesForSale = () => {
    const imagesForSale = search.filter((ele) => ele.sellImg);
    if (!search || !userProfile) {
      return "Loading...";
    } else if (imagesForSale.length === 0) {
      return <Alert variant={"dark"}>There are no photos for sale that match this query.</Alert>;
    }

    return (
      <div className="accounts-image-container">
        <div className="image-list-home">
          {imagesForSale.map((image) => (
            <ImageCard
              key={image._id}
              description={image.caption}
              src={`/api/image/${image._id}`}
              imageTitle={`${image.price} Credits`}
              imageDescription={image.caption}
              imageDate={image.timeText}
              href={userProfile._id === image.ownerUserID ? `/account` : `/buy/${image._id}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <Container className="container-padding">
        <Row>
          <h3>Search</h3>
          <p>Showing search results from the phrase "{query}"</p>
        </Row>
        <Row>
          <h3>Your Images</h3>
          {renderYourImagesResults()}
        </Row>
        <Row>
          <h3>Images For Sale</h3>
          {renderImagesForSale()}
        </Row>
      </Container>
      <Footer />
    </>
  );
};

const mapStateToProps = ({ search, userProfile }) => {
  return { search, userProfile };
};

export default connect(mapStateToProps, { fetchImagesBySearch, fetchUserData })(Search);
