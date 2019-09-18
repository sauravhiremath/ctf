$(document).on("dblclick", ".desktop-icon", function(){
    var button = $(this);
    var difficulty = $(this).attr("id");
    var solved = $(this).attr("name");
    console.log(solved);
    $.ajax({
        type: "GET",
        url: "home/questionStatus",
        data: {
            "sortKey": "difficulty",
            "solved": solved
        },
        success: function(result){
            var arr=result["allChallenges"]
            console.log(arr);
            if(solved=="False"){
                var filtered = arr.filter(question=>question.difficulty==difficulty)
                if(filtered.length === 0) return;
                console.log(filtered);
                var data = '';
                for(var i=0; i<filtered.length; i++){
                    var question_data = '<button class="btn singlePopup question-icon" value='+ filtered[i].name +' id='+ filtered[i]._id +'> <div class="icon-container"><img src="/static/images/recycle_bin.png" alt=""><span class="question-title">'+ filtered[i].name +'</span></div></button>'
                    data+=question_data;
                }
            }
            else{
                if(arr.length === 0) return;
                var data='';
                for(var i=0; i<arr.length; i++){
                    var question_data = '<button class="btn singlePopup question-icon" value='+ arr[i].name +' id='+ arr[i]._id +' disabled> <div class="icon-container"><img src="/static/images/recycle_bin.png" alt=""><span class="question-title">'+ arr[i].name +'</span></div></button>'
                    data+=question_data;
                }
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
    })
})


$(document).on("dblclick", ".question-icon", function(){
    var button = $(this);
    var id = $(this).attr("id");
    $.ajax({
        type: "POST",
        url: "/home/question",
        data: {
            "qid": id,
        },
        success: function(result){
                var data = result["message"]
                console.log(data);
                var question_text = '<p>'+ data.description +'</p>'
                var text_field = '<div class="col-10"><input type="text" class="w-100 pl-1" name="flag-input" placeholder="CSICTF{}"></div><div class=" pl-3 w-50"><button class="pl-3 pr-3 submit-button" id='+ data.id + ' data-toggle="modal">Submit</button></div>'
                var people = data["solvedBy"];
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
                    if(people.length === 0){
                        statsHtml = "Noone has solved this question yet";
                    }
                    else{
                        var statsHtml = '';
                        for(var i=0; i<people.length; i++){
                            singleDiv='<div class="py-2">'+ people[i] +'</div>'
                            statsHtml += singleDiv;
                        }
                    }
                    $("#nav_content").html(statsHtml);
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
        error: function(data){
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
                $(".message").html(data["message"]);
                $("#singlePopupModal").modal('hide');
                $("#successPopup").modal({
                    show: true,
                    backdrop: false
                });
                $('#'+id).hide();
                console.log("hidden");
            }
            else{
                message = data["message"];
                console.log(message);
                $(".message").html(message);
                $("#successPopup").modal({
                    show: true,
                    backdrop: false
                });
            }
        },
        error: data => {
            console.log(data);
        }

    });
})

