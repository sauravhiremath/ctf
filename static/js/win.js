document.getElementsByTagName("img").draggable = false;
console.log("hello")


$(document).on("click", ".btn", function(){
    var cl = $(this).attr("class");
    cl = cl.split(" ");
    var id = cl[1];
    $('#' + id + 'Modal').modal({
        show: true,
        backdrop: false,
    }).draggable({
        handle: ".app_header"
    })
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

$(document).on("click", "#question_text", function(){
    $("#nav_content").html("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime a vero distinctio non. Quae eos a dolor ab ut similique tenetur minima autem ea accusamus. Voluptatibus odio optio aperiam adipisci?")
})

$(document).on("click", "#trend", function(){
    $("#nav_content").html("Trends here");
})

$(document).on("click", "#no_of_people", function(){
    $("#nav_content").html("Stats here");
})