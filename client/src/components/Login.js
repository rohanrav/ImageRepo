import React from "react";
import Button from "react-bootstrap/Button";

import Header from "./partials/Header";
import Footer from "./partials/Footer";

const Login = () => {
  return (
    <div className="login-main">
      <Header isLoggedIn={false} />
      <div className="login-info">
        <h3 className="login-logo">ImageRepo</h3>
        <h4>
          ImageRepo is the easiest way to buy and sell your favourite photographs! Use our AI powered search
          bar to find specfic images or browse our home page casually. Add credits to your account or upload
          an image to get started today.
        </h4>
        <Button className="primary-blue" size="lg" href="/auth/facebook" variant="primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-facebook"
            viewBox="0 0 18 18"
          >
            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
          </svg>{" "}
          Log In With Facebook
        </Button>
      </div>
      <Footer isLoggedIn={false} anchorBottom={true} displayInfoText={false} />
    </div>
  );
};
export default Login;
