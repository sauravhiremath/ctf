$(document).on("dblclick", ".desktop-icon", function () {
    var button = $(this);
    var difficulty = $(this).attr("id");
    diff = difficulty.toLowerCase();
    var solved = $(this).attr("name");
    $.ajax({
        type: "GET",
        url: "home/questionStatus",
        data: {
            "sortKey": "difficulty",
            "solved": solved
        },
        success: function (result) {
            var arr = result["allChallenges"]
            //unsolved question
            if (solved == "False") {
                $(".question-type").html(difficulty);
                var filtered = arr.filter(question=>question.difficulty==diff)
                if(filtered.length === 0) {
                    var text = "No questions left from this catagory";
                    var htmlData = '<img src="/static/images/wrong-ans.png" style="width: 30px; height:30px" class="start-icons" alt=""><div class="pl-2 pb-4">'+ text +'</div><br>'
                    $(".message").html(htmlData);
                    $(".header-text").html("Uh-oh");
                    $("#errorModal").modal({
                        show: true,
                        backdrop: false
                    });
                    document.getElementById("duh").play();
                    return;
                };
                var data = '';
                for (var i = 0; i < filtered.length; i++) {
                    var image = filtered[i].name.toLowerCase().replace(" ", "-");
                    var divId = filtered[i]._id + "div"
                    var question_data = '<div class="flex" id='+ divId + '><button class="btn singlePopup question-icon" value='+ filtered[i].name +' id='+ filtered[i]._id +'> <div class="icon-container"><img src="/static/images/'+ image +'.png" style="width:32px; height:32px" alt=""><span class="question-title ml-1">'+ filtered[i].name +'</span></div></button></div>'
                    data+=question_data;
                }
            }
            //solved questions
            else {
                if (arr.length === 0) {
                    var text = "No questions solved yet";
                    var htmlData = '<img src="/static/images/wrong-ans.png" style="width: 30px; height:30px" class="start-icons" alt=""><div class="pl-2 pb-4">'+ text +'</div><br>'
                    $(".message").html(htmlData);
                    $(".header-text").html("Uh-oh");
                    $("#errorModal").modal({
                        show: true,
                        backdrop: false
                    });
                    document.getElementById("duh").play();
                    return;
                }
                else {
                    var data = '';
                    $(".question-type").html(difficulty)
                    for(var i=0; i<arr.length; i++){
                        var image = arr[i].name.toLowerCase().replace(" ", "-");
                        var question_data = '<button class="btn singlePopup question-icon d-inline-flex" id='+ arr[i]._id + ' value='+ arr[i].name +' id='+ arr[i]._id +' disabled> <div class="icon-container"><img src="/static/images/'+ image +'.png" style="width:32px; height:32px" alt=""><span class="question-title ml-1">'+ arr[i].name +'</span></div></button>'
                        data+=question_data;
                    }
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

$(document).on("click", ".start-icon-modal", function(){
    var button = $(this);
    var difficulty = $(this).attr("id");
    diff = difficulty.toLowerCase();
    var solved = $(this).attr("name");
    $.ajax({
        type: "GET",
        url: "home/questionStatus",
        data: {
            "sortKey": "difficulty",
            "solved": solved
        },
        success: function(result){
            var arr=result["allChallenges"]
            //unsolved question
            if(solved=="False"){
                $(".question-type").html(difficulty);
                var filtered = arr.filter(question=>question.difficulty==diff)
                if(filtered.length === 0) return;
                var data = '';
                for(var i=0; i<filtered.length; i++){
                    var image = filtered[i].name.toLowerCase().replace(" ", "-");
                    var question_data = '<button class="btn singlePopup question-icon d-inline-flex" id='+ filtered[i]._id + ' value='+ filtered[i].name +' id='+ filtered[i]._id +'> <div class="icon-container"><img src="/static/images/'+ image +'.png" style="width: 32px; height: 32px" alt=""><span class="question-title ml-1">'+ filtered[i].name +'</span></div></button>'
                    data+=question_data;
                }
            }
            //solved questions
            else{
                if(arr.length === 0){
                    var message = "No questions solved yet";
                    $(".message").html(message);
                    $("#errorModal").modal({
                        show: true,
                        backdrop: false
                    });
                    return;
                };
                var data='';
                $(".question-type").html(difficulty)
                for(var i=0; i<arr.length; i++){
                    var image = arr[i].name.toLowerCase().replace(" ", "-");
                    var question_data = '<button class="btn singlePopup question-icon d-inline-flex" id='+ filtered[i]._id + ' value='+ arr[i].name +' id='+ arr[i]._id +' disabled> <div class="icon-container"><img src="/static/images/'+ image +'.png" style="width:32px; height:32px" alt=""><span class="question-title ml-1">'+ arr[i].name +'</span></div></button>'
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


$(document).on("dblclick", ".question-icon", function () {
    var button = $(this);
    var id = $(this).attr("id");
    $.ajax({
        type: "GET",
        url: "/home/question",
        data: {
            "qid": id,
        },
        success: function(result){
                var data = result["message"]
                var questionName = data.qname;
                var questionCatagory = '<div class="d-flex p-2"><strong>Catagory: '+ data.type +'</strong><div class="ml-auto"><strong>Current Points: '+ data.currentPoints +'</strong></div></div><div class="d-flex pr-2"><div class="ml-auto"><strong> Start Points: '+ data.startPoints +'</strong></div></div>'
                var question_text = '<p class="selectable">'+ data.description +'</p>'
                for(var i=0;i<data["solvedBy"].length;i++){
                    if(data["solvedBy"][i].username.includes(data.username)){
                        var solved = true;
                        break;
                    }
                    else{
                        var solved = false;
                    }
                }
                if(solved){
                    var text_field = '<div class="ml-auto mr-auto"><strong>You have already solved this question</strong></div>'    
                }
                else{
                    var text_field = '<form class="w-100 row no-gutters" onsubmit="return sendAns(event);" id="flagSubmitForm" data-qid="' + data.id + '"><div class="col-10"><input type="text" class="w-100 pl-1" name="flag-input" placeholder="CSICTF{The_flag_goes_here}"></div><div class="col-2"><button type="submit" class="ml-3 pl-3 pr-3 submit-button" id='+ data.id + ' data-toggle="modal">Submit</button></div></form>'
                }
                var people = data["solvedBy"];
                $(".question-name").html(questionName);
                $("#nav_content").html(question_text);
                $("#submit-div").html(text_field)
                $("#question-catagory").html(questionCatagory);

            $(document).on("click", "#question_text", function (e) {
                e.preventDefault();
                $("#nav_content").html(question_text);
            })
            $(document).on("click", "#trend", function (e) {
                e.preventDefault();
                $("#nav_content").html("Statistics coming soon");
            })

            $(document).on("click", "#no_of_people", function (e) {
                e.preventDefault();
                if (people.length === 0) {
                    statsHtml = "Noone has solved this question yet";
                }
                else {
                    var statsHtml = '';
                    for (var i = 0; i < people.length; i++) {
                        var time = people[i].usertime;
                        var date = Date.parse(time);
                        date = date + (5.5*60*60*1000);
                        var newTime = new Date(date);
                        newTime = newTime.toString();
                        newTime = newTime.split(' ').slice(0,5).join(' ')
                        singleDiv = '<div class="d-flex">' + (i + 1) + ". " + people[i].username + '<div class="ml-auto">' + newTime + '</div></div><hr>'
                        statsHtml += singleDiv;
                    }
                }
                $("#nav_content").html(statsHtml);
            })
            $("#singlePopupModal").modal({
                show: true,
                backdrop: false
            }).draggable({
                handle: ".app_header"
            })
        },
        error: function (data) {
            console.log(data);
        },
    })
})


function sendAns(e) {
    e.preventDefault();
    const inputFlag = $("input[name='flag-input']")
    var flag = $(inputFlag).val();
    const id = $('#flagSubmitForm').attr("data-qid");
    const time = new Date;
    submitData = {
        "qid": id,
        "ctfFlag": flag,
        "timeStampUser": time,
    }
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
                $(".header-text").html("Success!")
                var htmlData = '<img src="/static/images/correct-ans.png" style="width: 30px; height:30px" class="start-icons" alt=""><div class="pl-2 pb-4">Flag Captured</div><br>'
                $(".message").html(htmlData);
                $("#singlePopupModal").modal('hide');
                $("#errorModal").modal({
                    show: true,
                    backdrop: false
                })
                var parentDiv = '#'+id +'div';
                $(parentDiv).hide();
            }
            else{
                var text = data.message;
                var htmlData = '<img src="/static/images/wrong-ans.png" style="width: 30px; height:30px" class="start-icons" alt=""><div class="pl-2 pb-4">'+ text +'</div><br>'
                $(".message").html(htmlData);
                $(".header-text").html("Uh-oh")
                $("#errorModal").modal({
                    show: true,
                    backdrop: false
                });
                document.getElementById("duh").play();
            }
        },
        error: data => {
            console.log(data);
        }

    });
    return false;
}

