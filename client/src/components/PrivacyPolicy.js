import React from "react";
import Header from "./partials/Header";
import Footer from "./partials/Footer";

const PrivacyPolicy = ({}) => {
  return (
    <div>
      <Header isLoggedIn={false} />
      <Footer anchorBottom={true} />
    </div>
  );
};

export default PrivacyPolicy;
