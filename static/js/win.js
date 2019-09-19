document.getElementsByTagName("img").draggable = false;
console.log("hello")

// $(function () {
//     $(".tmngr_btn").click(function () {
//         $(".tmngr_btn").removeClass("active");
//         $(this).addClass("active");
//     });

//     // for(const user of socketData){
//     //     let elem = $(`<p> ${user.name}: ${user.points} </p>`);
//     //     $(".leaderboard_display_names").append(elem);
//     // }
// });

$(document).on("click", "#leaderBtn", function(){
    $.ajax({
        type: "GET",
        url: "/leaderboard",
        data: "data",
        dataType: "dataType",
        success: function (data) {
            
        }
    });
})

$(document).on("dblclick",".desktop-icon-2", function(){
    $("#rulesPopup").modal({
        show: true,
        backdrop: false
    }).draggable({
        handle: ".app_header"
    });
})

$(document).on("click", "#leaderBtn", function (e) {

    $("#leaderBoardPopup").modal({
        show: true,
        backdrop: false
    }).draggable({
        handle: ".app_header"
    });
})


$(document).on("click", ".closeIcon", function(){
    $('#questionPopupModal').modal('hide')
})
$(document).on("click", ".close-success", function(){
    $('#errorModal').modal('hide')
})
$(document).on("click", ".closebtn", function(){
   $('#singlePopupModal').modal('hide')
})
$(document).on("click", ".closeQuestion", function () {
    $('#singlePopupModal').modal('hide')
})

$(document).on("click", ".nav-item", function(){
    $(".nav-item").removeClass("active-nav");
    $(this).addClass("active-nav");
})
