$.ajax({
    type: 'POST',
    url: 'http://localhost:3000/size',
    data: { width: window.innerWidth, height: window.innerHeight },
}).done(function(res) {
    console.log(res);
})