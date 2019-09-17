document.getElementsByTagName("img").draggable = false;
console.log("hello")





$(document).on("click", ".closeIcon", function(){
    $('#questionPopupModal').modal('hide')
})
$(document).on("click", ".closebtn", function(){
   $('#singlePopupModal').modal('hide')
})
$(document).on("click", ".closeQuestion", function(){
    $('#singlePopupModal').modal('hide')
})


$(document).on("click", "#trend", function(){
    $("#nav_content").html("Trends here");
})

$(document).on("click", "#no_of_people", function(){
    $("#nav_content").html("Stats here");
})
