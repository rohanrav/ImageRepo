import React from "react";
import BaseError from "./BaseError";

const ErrorTitle = () => {
  return (
    <>
      Uh oh! There's been an <span>error!</span>
    </>
  );
};

const ErrorDescription = () => {
  return (
    <>
      An error has occured on our end. Please log in again to resolve the error and{" "}
      <a
        style={{ cursor: "pointer", color: "#6c757d", textDecoration: "underline 0.5px" }}
        href="mailto:r8ravind@uwaterloo.ca?subject=ImageRepo%20Bug%2FInquiry"
        target="_blank"
        rel="noreferrer"
      >
        contact us
      </a>{" "}
      if the error persists.
    </>
  );
};

const GeneralError = () => {
  return <BaseError errorTitle={<ErrorTitle />} errorDescription={<ErrorDescription />} />;
};

export default GeneralError;
