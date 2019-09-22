document.getElementsByTagName("img").draggable = false;


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

// $(document).on("click", "#leaderBtn", function(){
//     $.ajax({
//         type: "GET",
//         url: "home/leaderboard",
//         success: function (data) {
//             var leaderboard = ''
//             for(var i=0; i<data.length; i++){
//                 var singleDiv = '<div class="d-flex">'+ (i+1)+". " + data[i].username +'<div class="ml-auto">'+ data[i].points +'</div></div><hr>'
//                 leaderboard += singleDiv;
//             }
//             $("#leaderboard-content").html(leaderboard);
//         }
//     });
// })

$(document).on("dblclick",".desktop-icon-2", function(){
    $("#rulesPopup").modal({
        show: true,
        backdrop: false
    }).draggable({
        handle: ".app_header"
    });
})

$(document).on("dblclick",".desktop-icon-3", function(){
    // $.ajax({
    //     type: "GET",
    //     url: "home/leaderboard",
    //     success: function (data) {
            $(".header-text").html("CSI-CTF")
            // for(var i=0; i<data.length; i++){
            //     var singleDiv = '<div class="d-flex">'+ (i+1)+". " + data[i].username +'<div class="ml-auto">'+ data[i].points +'</div></div><hr>'
            //     leaderboard += singleDiv;
            // }
            // $("#leaderboard-content").html(leaderboard);
            // $("#leaderBoardPopup").modal({
            //     show: true,
            //     backdrop: false
            // }).draggable({
            //     handle: ".app_header"
            // });
            var leaderboard = '<img src="/static/images/info.png" style="width: 30px; height:30px" class="start-icons" alt=""><div class="pl-2 pb-2">The CTF ends at 00:37<br>Leaderboard will be hidden for the last hour<br>Results will be out on our social media soon</div><br>'
            $(".message").html(leaderboard);
            $("#errorModal").modal({
                show: true,
                backdrop: false
            })
})

$(document).on("click", "#leaderBtn", function (e) {
    $(".header-text").html("CSI-CTF")
    var leaderboard = '<img src="/static/images/info.png" style="width: 30px; height:30px" class="start-icons" alt=""><div class="pl-2 pb-2">The CTF ends at 00:37<br>Leaderboard will be hidden for the last hour<br>Results will be out on our social media soon</div><br>'
            $(".message").html(leaderboard);
            $("#errorModal").modal({
                show: true,
                backdrop: false
            })

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

$(document).on("click", ".question-nav", function(){
    $(".question-nav").removeClass("active-nav");
    $(this).addClass("active-nav");
})

$(document).on("click", ".nav-item", function(e){
    e.preventDefault();
})


$(document).on("click", ".logoff", function(){
    $.ajax({
        method: "GET",
        url: "/auth/logout",
        success: function(){
            window.location.href = 'auth/register'
        },
    })
})

$(document).on("click", ".poweroff", function(){
    $.ajax({
        method: "GET",
        url: "/auth/logout",
        success: function(){
            window.location.href = 'auth/register'
        },
    })
})

$(document).on("click", ".end-submit", function(){
    var name = $("input[name='username']").val();
    var feedback = $("input[name='feedback']").val();
    if(!name || !feedback){
        alert("Fields with * cannot be empty");
    }
    $.ajax({
        method: "POST",
        url: "/feedback",
        data: {
            username: name,
            feedback: feedback
        },
        success: data=> {
            if(data.success == false){
                alert(data.message);
            }
            else{
                alert("Thank You");
            }
        },
    })
})