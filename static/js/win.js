document.getElementsByTagName("img").draggable = false;
console.log("hello")

$(document).on("click", "#leaderBtn", function(){
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
$(document).on("click", ".closebtn", function(){
   $('#singlePopupModal').modal('hide')
})
$(document).on("click", ".closeQuestion", function(){
    $('#singlePopupModal').modal('hide')
})


