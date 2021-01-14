$(document).ready(function() {
    $.ajax({
        type: 'POST',
        url: `${window.location.origin}/size`,
        data: { width: window.innerWidth, height: window.innerHeight },
    }).done(function(res) {
        console.log(res);
    })

    let width = window.innerWidth
    let send = 1

    if (width >= 1350) {
        send = 4
    } else if (width >= 1080 && width <= 1350) {
        send = 3
    } else if (width >= 760 && width <= 1080) {
        send = 2
    } else {
        send = 1
    }

    let count = $('.card-group')[$('.card-group').length - 1].children.length
    if (count === 1) {
        $('.card-group')[$('.card-group').length - 1].setAttribute("style", `width:${(1/send)*100}%`)
    } else if (count === 2) {
        $('.card-group')[$('.card-group').length - 1].setAttribute("style", `width:${(2/send)*100}%`)
    } else if (count === 3) {
        $('.card-group')[$('.card-group').length - 1].setAttribute("style", `width:${(3/send)*100}%`)
    } else {
        $('.card-group')[$('.card-group').length - 1].setAttribute("style", `width:${(4/send)*100}%`)
    }
})