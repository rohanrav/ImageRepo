import React from "react";
import BaseError from "./BaseError";

const ErrorTitle = () => {
  return (
    <>
      <span>404</span> Page Not Found!
    </>
  );
};

const PageNotFoundError = () => {
  return (
    <BaseError
      errorTitle={<ErrorTitle />}
      errorDescription="This web page does not exist! This is not the page you are looking for :)"
      btnText="Home"
      btnHref="/home"
    />
  );
};

export default PageNotFoundError;
