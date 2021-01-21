# ImageRepo
ImageRepo is an Image Repository service, where users can buy and sell images easily. The site is currently running at the link: https://shielded-river-42859.herokuapp.com/

## Description
When users visit the site, they will be prompted to register or login. Once authenticated, users can buy images posted by other users and upload and sell their own images. See the screenshots below:

#### Home Page
![](https://github.com/rohanrav/ImageRepo/blob/master/images/home.png)

#### Account Page
![](https://github.com/rohanrav/ImageRepo/blob/master/images/account.png)

Users can use the search bar to search for images by their caption, characteristics, or similar images via reverse image search. See the screenshots below:

#### Search Page
![](https://github.com/rohanrav/ImageRepo/blob/master/images/search.png)

## How to use:
1. Visit the site at the link here: https://shielded-river-42859.herokuapp.com/. 
2. Enter an email and password to create your account
3. Browse and purchase the images for sale on the home page
4. On the account page, upload and view your own images, add credits to your account (use the credit card number 4242 4242 4242 4242 for testing purposes), and view your purchase history
5. On the Sell Image page, set the price of the images you want to sell
6. Search for images by characteristics, captions, and similar images using the Reverse Image Search Feature

## How was it built
The application was built using Node, Express, and MongoDB. 
- In order to securely login and register users, Bcrypt along with Passport.js was used to track if a user is logged in, persist their login session using cookies, and safely hash and salt their password for security.
- In order to provide a more comprehensive image search functionality Google's CoCoSSD ML model was used in order to search images by characteristics. Additionally, Jimp's hamming distance and pixel difference algorithms were used for the reverse image search functionality to provide similar images.
- Used the Stripe Payment API to handle all monetary transactions.
- Used EJS, HTML, and CSS to implement the front-end of the site.
