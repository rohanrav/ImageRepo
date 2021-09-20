import React, { useEffect } from "react";

import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { fetchHomeImages } from "../actions";
import { connect } from "react-redux";

import ImageCard from "./partials/ImageCardOverlay";
const Home = ({ fetchHomeImages, homeImages }) => {
  useEffect(() => {
    fetchHomeImages();
  }, [fetchHomeImages]);

  const renderImageCards = () => {
    if (!homeImages || homeImages.length === 0) {
      return (
        <div className="full-spinner">
          <Spinner animation="border" role="status" style={{ position: "relative", top: "50%" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    return (
      <div className="home-container">
        <div className="image-list-home">
          {" "}
          {homeImages.map((image) => (
            <ImageCard
              key={image._id}
              description={image.caption}
              src={`/api/image/${image._id}`}
              imageTitle={`${image.price} Credits`}
              imageDescription={image.caption}
              imageDate={image.timeText}
              href={`/buy/${image._id}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <Container>{renderImageCards()}</Container>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    homeImages: state.homeImages,
  };
};

export default connect(mapStateToProps, { fetchHomeImages })(Home);
