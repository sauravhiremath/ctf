$(document).on("dblclick", ".desktop-icon", function(){
    var button = $(this);
    var difficulty = $(this).attr("name");
    $.ajax({
        type: "GET",
        url: "/home/questionStatus",
        data: {
            "sortKey": "difficulty",
        },
        success: function(result){
            var arr=result["allChallenges"]
            var filtered = arr.filter(question=>question.difficulty==difficulty)
            if(filtered.length === 0) return;
            console.log(filtered);
            var data = '';
            for(var i=0; i<filtered.length; i++){
                var question_data = '<button class="btn singlePopup question-icon"> <div class="icon-container"><img src="/static/images/recycle_bin.png" alt=""><span class="question-title" value='+ filtered.name +'>'+ filtered.name +'</span></div></button>'
                data+=question_data;
            }
            document.getElementById("question-data").innerHTML = data;
            console.log(data);
            // var popupHtml = $("#question-template").html();
            // console.log(popupHtml);
            // var theTemplate = Handlebars.compile(popupHtml);
            // var contextObj = {name: "hello"};
            // var compileHtml = theTemplate(contextObj);
            // console.log(compileHtml);
            // $("#question-data").html(compileHtml);
            
            var cl = $(button).attr("class");
            cl = cl.split(" ");
            var id = cl[1];
            $('#' + id + 'Modal').modal({
                show: true,
                backdrop: false,
            }).draggable({
                handle: ".app_header"
            })
        },
        error: function(){
                console.log(err);
        },
    })
})



$(document).on("dblclick", ".question-icon", function(){
    var button = $(this);
    var questionName = $(this).attr("value");
    $.ajax({
        type: "POST",
        url: "/home/question",
        data: {
            "qname": questionName,
        },
        success: function(result){
                console.log(result);
                var cl = $(button).attr("class");
                cl = cl.split(" ");
                var id = cl[1];
                $('#' + id + 'Modal').modal({
                    show: true,
                    backdrop: false,
                }).draggable({
                    handle: ".app_header"
                })
        },
        error: function(){
                console.log(data);
        },
    })
})




$(document).on("click", ".flag_submit", function(){
    const inputFlag = $("input[name='flag_input']")
    var flag = $(inputFlag).val();
    console.log(flag);
    $.ajax({
        method: "POST",
        url: "/submit",
        // data: {
        //     qid: 1,
        //     ctfFlag: flag,
        //     username: "uname",
        // },
        success: data=>{
            if(data["solved"] == true){
                console.log("yes");
                $("#singlePopupModal").modal('hide');
                $("#successModal").modal('show')
            }
            else{
                console.log("no");
                $("#successModal").modal('show')
            }
        },

    });
})

