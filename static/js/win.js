document.getElementsByTagName("img").draggable = false;
console.log("hello")

var socketData = [

    { name: "david", points: 42 }, { name: "velho", points: 43 },
    { name: "devam", points: 45 }, { name: "kuhoo", points: 52 },
    { name: "rishit", points: 72 }, { name: "rohan", points: 40 },
    { name: "ayush", points: 22 }, { name: "namit", points: 142 }

];



$(function () {
    // $(".tmngr_btn").click(function () {
    //     $(".tmngr_btn").removeClass("active");
    //     console.log(this);
    //     $(this).addClass("active");
    // });

    for(const user of socketData){
        let elem = $(`<p> ${user.name}: ${user.points} </p>`);
        $(".leaderboard_display_names").append(elem);
    }
});



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


$(document).on("click", ".tmngr_btn", function () {

    //$("#leaderboard_names").addClass("active");
});
