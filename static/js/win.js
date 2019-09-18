document.getElementsByTagName("img").draggable = false;
console.log("hello")

$(document).on("click", "#leaderBtn", function (e) {

    $("#leaderBoardPopup").modal({

        show: true,
        backdrop: false
    }).draggable({
        handle: ".app_header"
    });
})



$(document).on("click", ".closeIcon", function () {
    $('#questionPopupModal').modal('hide')
})
$(document).on("click", ".closebtn", function () {
    $('#singlePopupModal').modal('hide')
})
$(document).on("click", ".closeQuestion", function () {
    $('#singlePopupModal').modal('hide')
})

$(function () {
    $(".tmngr_btn").click(function () {
        $(".tmngr_btn").removeClass("active");
        console.log(this);
        $(this).addClass("active");
    });
});


$(document).on("click", ".tmngr_btn", function () {

    //$("#leaderboard_names").addClass("active");
});
