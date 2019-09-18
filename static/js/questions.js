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
                var question_data = '<button class="btn singlePopup question-icon" value='+ filtered[i].name +' id='+ filtered[i]._id +'> <div class="icon-container"><img src="/static/images/recycle_bin.png" alt=""><span class="question-title">'+ filtered[i].name +'</span></div></button>'
                data+=question_data;
            }
            document.getElementById("question-data").innerHTML = data;
            
            var cl = $(button).attr("class");
            cl = cl.split(" ");
            var id = cl[1];
            $('#' + id + 'Modal').modal({
                show: true,
                backdrop: false
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
                data = result["message"]
                var question_text = '<p>'+ data.description +'</p>'
                console.log(data)
                var text_field = '<div class="col-10"><input type="text" class="w-100" name="flag-input"></div><div class=" pl-3 w-50"><button class="pl-3 pr-3 submit-button" id='+ data.id + '>submit</button></div>'
                $("#nav_content").html(question_text);
                $("#submit-div").html(text_field);
                
                $(document).on("click", "#question_text", function(e){
                    e.preventDefault();
                    $("#nav_content").html(question_text);
                })
                $(document).on("click", "#trend", function(e){
                    e.preventDefault();
                    $("#nav_content").html("Trends here");
                })
                
                $(document).on("click", "#no_of_people", function(e){
                    e.preventDefault();
                    $("#nav_content").html("Stats here");
                })
                
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


$(document).on("click", ".submit-button", function(){
    const inputFlag = $("input[name='flag-input']")
    var flag = $(inputFlag).val();
    const id = $(this).attr("id");
    const time = new Date;
    console.log(time);
    submitData = {
        "qid": id,
        "ctfFlag": flag,
        "timeStampUser": time,
    }
    console.log(flag);
    $.ajax({
        method: "POST",
        url: "/home/submit",
        data: {
            "qid": id,
            "ctfFlag": flag,
            "timeStampUser": time,
        },
        success: data =>{
            if(data["success"] == true){
                console.log("yes");
            }
            else{
                console.log("no");
                
            }
        },
        error: data =>{
            console.log(data);
        }

    });
})

