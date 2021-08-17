const passport = require("passport");
const _ = require("lodash");

module.exports = (app) => {
  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      scope: ["email", "public_profile"],
    })
  );

  app.get("/auth/facebook/callback", passport.authenticate("facebook"), (req, res) => {
    res.redirect("/home");
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.status(200).json({ success: "true" });
  });

  app.get("/api/current-user", (req, res) => {
    res.status(200).json(req.user);
  });

  app.get("/api/current-user-profile", (req, res) => {
    res.status(200).json(_.pick(req.user, ["givenName", "familyName", "email", "credits"]));
  });
};
