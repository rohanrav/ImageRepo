$(document).ready(function() {
    let count = $('.card-group')[$('.card-group').length - 1].children.length
    if (count === 1) {
        $('.card-group')[$('.card-group').length - 1].setAttribute("style", "width:25%")
    } else if (count === 2) {
        $('.card-group')[$('.card-group').length - 1].setAttribute("style", "width:50%")
    } else if (count === 3) {
        $('.card-group')[$('.card-group').length - 1].setAttribute("style", "width:75%")
    } else {
        $('.card-group')[$('.card-group').length - 1].setAttribute("style", "width:100%")
    }
})