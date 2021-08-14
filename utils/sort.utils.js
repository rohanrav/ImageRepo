const getTimeDiffAndPrettyText = require("./time.utils");

const sortHome = (a, b) => {
  if (new Date() - a.date > new Date() - b.date) {
    return 1;
  } else if (new Date() - a.date < new Date() - b.date) {
    return -1;
  } else {
    return 0;
  }
};

const sortReverseImageSearch = (a, b) => {
  if (a.difference < b.difference) {
    return -1;
  } else if (a.difference > b.difference) {
    return 1;
  } else {
    return 0;
  }
};

const getTimeText = (image) => {
  image.timeText = getTimeDiffAndPrettyText(image.date).friendlyNiceText;
};

module.exports = {
  sortHome,
  sortReverseImageSearch,
  getTimeText,
};
