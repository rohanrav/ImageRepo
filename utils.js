const { getTimeDiffAndPrettyText } = require("./timeParsing")

function sortHome(a, b) {
    if ((new Date() - a.date) > (new Date() - b.date)) {
        return 1
    } else if ((new Date() - a.date) < (new Date() - b.date)) {
        return -1
    } else {
        return 0
    }
}

function sortReverseImageSearch(a, b) {
    if (a.difference < b.difference) {
        return -1
    } else if (a.difference > b.difference) {
        return 1
    } else {
        return 0
    }
}

function getTimeText(image) {
    image.timeText = getTimeDiffAndPrettyText(image.date).friendlyNiceText
}

exports.sortHome = sortHome
exports.sortReverseImageSearch = sortReverseImageSearch
exports.getTimeText = getTimeText