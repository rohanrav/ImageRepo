# ImageRepo
ImageRepo is an Image Repository service, where users can buy and sell images easily. The site is currently running at the link: https://shielded-river-42859.herokuapp.com/

## Description
When users visit the site, they will be prompted to register or login. Once authenticated users can buy images posted by others users and upload and sell their own images. See the images below:

#### Home Page
![](https://github.com/rohanrav/ImageRepo/blob/master/images/home.png)
\n
#### Account Page
![](https://github.com/rohanrav/ImageRepo/blob/master/images/account.png)

Users can use the search bar to search for images by their caption, characteristics, or similar images via reverse image search. See the images below:

![](https://github.com/rohanrav/ImageRepo/blob/master/images/search.png)
Search Page

## How was it built
The application was built using Node, Express, and MongoDB. In order to securely login and register users, Bcrypt along with Passport.js was used to track if a user is logged in, persist their login session using cookies, and safely hash and salt their password for security. In order to provide a more comprehensive image search functionality Google's CoCoSSD ML model was used in order to search images by characteristics. Additionally, Jimp's hamming distance and pixel difference algorithms were used for the reverse image search functionality to provide similar images. Stripe was used to handle all payments.
