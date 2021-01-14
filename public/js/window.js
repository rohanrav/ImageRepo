$.ajax({
    type: 'POST',
    url: `${window.location.origin}/size`,
    data: { width: window.innerWidth, height: window.innerHeight },
}).done(function(res) {
    console.log(res);
})