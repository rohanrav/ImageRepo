module.exports = (app) => {
  app.get("/api/images/:num", (req, res) => {});

  app.get("/api/own-images/buy", (req, res) => {});

  app.get("/api/own-images/sell", (req, res) => {});

  app.get("/api/image/:id", (req, res) => {}); // app.post same route to sell image, this to buy an image

  app.get("/api/purchase-history", (req, res) => {});

  app.get("/api/more-images/:id", (req, res) => {});

  // search GET
  // upload-reverse-image-search POST
  // upload-image POST
  // sell-image GET
  // ALL Stripe routes
};
