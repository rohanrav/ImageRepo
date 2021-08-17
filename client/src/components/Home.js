import React, { useEffect } from "react";

import Header from "./partials/Header";
import Footer from "./partials/Footer";
import Container from "react-bootstrap/Container";
import { fetchHomeImages } from "../actions";
import { connect } from "react-redux";

import ImageCard from "./partials/ImageCard";
const Home = ({ fetchHomeImages, homeImages }) => {
  useEffect(() => {
    fetchHomeImages();
  }, [fetchHomeImages]);

  const renderImageCards = () => {
    if (!homeImages || homeImages.length === 0) {
      return "Loading...";
    }

    return homeImages.map((image) => (
      <ImageCard
        key={image._id}
        description={image.caption}
        src={`/api/image/${image._id}`}
        imageTitle={`${image.price} Credits`}
        imageDescription={image.caption}
        imageDate={image.timeText}
        href={`/buy/${image._id}`}
      />
    ));
  };

  return (
    <div>
      <Header />
      <Container>
        <div className="home-container">
          <div className="image-list-home">{renderImageCards()}</div>
        </div>
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

export default connect(mapStateToProps, { fetchHomeImages })(Home);
