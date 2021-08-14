$(document).ready(function () {
  var numClicked = 0;
  $("#select-img-btn").on("click", function () {
    if (numClicked % 2 == 0) {
      $(".checkmark-account").css("display", "inline-block");
      $("#select-img-btn").html("Exit Select Images Mode");
    } else {
      $(".checkmark-account").css("display", "none");
      $("#select-img-btn").html("Select Images");
    }
    numClicked += 1;
  });

  $(".panel").on("click", function () {
    let imgSrc = this.children[0].children[0].children[1].children[0].src;
    let caption = this.children[1].textContent;
    $("#previewImage").attr("src", imgSrc);
    $("#previewCaption").html(caption.toString());
    $("#downloadBtn").attr("href", imgSrc);
    $("#downloadBtn").attr("download", caption.toString());
  });

  var stripe = Stripe(
    "pk_test_51I6htECkQN1X0syTQMxWO5kBUZ7XpChuG1udwK2oFpgXiZ3kGR0JifdOT4A98Jjjt1EYmTcaouZhF6BVwHh6WOYL00uIsJ1X8a"
  );
  var checkoutButton = $("#checkout-button");

  checkoutButton.on("click", function (event) {
    fetch("/create-checkout-session", {
      method: "POST",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        return stripe.redirectToCheckout({
          sessionId: session.id,
        });
      })
      .then(function (result) {
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  });

  let preds;
  let classes = "";

  function animation(direction) {
    if (direction === "start") {
      $("#loader-wrapper-id").addClass("loader-wrapper").fadeIn(500);
      $("#loader-id").addClass("loader").fadeIn(500);
      $("#loader-inner-id").addClass("loader-inner").fadeIn(500);
    } else {
      $("#loader-wrapper-id").fadeOut(500, function () {
        $("#loader-wrapper-id").removeClass("loader-wrapper");
        $("#loader-id").removeClass("loader");
        $("#loader-inner-id").removeClass("loader-inner");
      });
    }
  }

  $("#formFile").on("change", function (event) {
    // start animation
    animation("start");

    const newImg = document.createElement("img");
    const file = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        newImg.src = reader.result;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }

    cocoSsd.load().then((model) => {
      model.detect(newImg).then((predictions) => {
        console.log("Predictions: ", predictions);
        preds = predictions;
        for (i = 0; i < preds.length; i++) {
          classes = classes + "|" + preds[i].class;
        }
        // end animation
        animation("stop");
        $("#add-btn").val(classes);
      });
    });
  });
});
