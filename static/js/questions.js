$(document).on("dblclick", ".desktop-icon", function(){
    var button = $(this);
    var difficulty = $(this).attr("id");
    diff = difficulty.toLowerCase();
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
            //unsolved question
            if(solved=="False"){
                $(".question-type").html(difficulty);
                var filtered = arr.filter(question=>question.difficulty==diff)
                if(filtered.length === 0) return;
                console.log(filtered);
                var data = '';
                for(var i=0; i<filtered.length; i++){
                    var image = filtered[i].name.toLowerCase().replace(" ", "-");
                    console.log(image);
                    var question_data = '<button class="btn singlePopup question-icon col-4 d-inline-flex" value='+ filtered[i].name +' id='+ filtered[i]._id +'> <div class="icon-container"><img src="/static/images/'+ image +'.png" width="32px" height="32px" alt=""><span class="question-title">'+ filtered[i].name +'</span></div></button>'
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
                }
                else{
                    var data='';
                    $(".question-type").html(difficulty)
                    for(var i=0; i<arr.length; i++){
                        var question_data = '<button class="btn singlePopup question-icon col-4 d-inline-flex" value='+ arr[i].name +' id='+ arr[i]._id +' disabled> <div class="icon-container"><img src="/static/images/'+ image +'.png" alt=""><span class="question-title">'+ arr[i].name +'</span></div></button>'
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

// $(document).on("click", ".start-icon-modal", function(){
//     var button = $(this);
//     var difficulty = $(this).attr("id");
//     diff = difficulty.toLowerCase();
//     var solved = $(this).attr("name");
//     console.log(solved);
//     $.ajax({
//         type: "GET",
//         url: "home/questionStatus",
//         data: {
//             "sortKey": "difficulty",
//             "solved": solved
//         },
//         success: function(result){
//             var arr=result["allChallenges"]
//             console.log(arr);
//             //unsolved question
//             if(solved=="False"){
//                 $(".question-type").html(difficulty);
//                 var filtered = arr.filter(question=>question.difficulty==diff)
//                 if(filtered.length === 0) return;
//                 console.log(filtered);
//                 var data = '';
//                 for(var i=0; i<filtered.length; i++){
//                     var image = filtered[i].name.toLowerCase().replace(" ", "-");
//                     console.log(image);
//                     var question_data = '<button class="btn singlePopup question-icon col-4 d-inline-flex" value='+ filtered[i].name +' id='+ filtered[i]._id +'> <div class="icon-container"><img src="/static/images/'+ image +'.png" alt=""><span class="question-title">'+ filtered[i].name +'</span></div></button>'
//                     data+=question_data;
//                 }
//             }
//             //solved questions
//             else{
//                 if(arr.length === 0){
//                     var message = "No questions solved yet";
//                     $(".message").html(message);
//                     $("#errorModal").modal({
//                         show: true,
//                         backdrop: false
//                     });
//                     return;
//                 };
//                 var data='';
//                 $(".question-type").html(difficulty)
//                 console.log(difficulty);
//                 for(var i=0; i<arr.length; i++){
//                     var image = arr[i].name.toLowerCase().replace(" ", "-");
//                     console.log("asdfsafasdf");
//                     var question_data = '<button class="btn singlePopup question-icon" value='+ arr[i].name +' id='+ arr[i]._id +' disabled> <div class="icon-container"><img src="/static/images/'+ image +'.png" alt=""><span class="question-title">'+ arr[i].name +'</span></div></button>'
//                     data+=question_data;
//                 }
//             }

//             document.getElementById("question-data").innerHTML = data;
//             var cl = $(button).attr("class");
//             cl = cl.split(" ");
//             var id = cl[1];
//             $('#' + id + 'Modal').modal({
//                 show: true,
//                 backdrop: false
//             }).draggable({
//                 handle: ".app_header"
//             })
//         },
//     })
// })


$(document).on("dblclick", ".question-icon", function(){
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
                console.log(data.qname);
                var questionName = data.qname;
                var questionCatagory = '<div class="d-flex p-2"><strong>Catagory: '+ data.type +'</strong><div class="ml-auto"><strong>Current Points: '+ data.currentPoints +'</strong></div></div><div class="d-flex pr-2"><div class="ml-auto"><strong> Start Points: '+ data.startPoints +'</strong></div></div>'
                var question_text = '<p>'+ data.description +'</p>'
                var text_field = '<div class="col-10"><input type="text" class="w-100 pl-1" name="flag-input" placeholder="CSICTF{The_flag_goes_here}"></div><div class=" pl-3 w-50"><button class="pl-3 pr-3 submit-button" id='+ data.id + ' data-toggle="modal">Submit</button></div>'
                var people = data["solvedBy"];
                $(".question-name").html(questionName);
                $("#nav_content").html(question_text);
                $("#submit-div").html(text_field)
                $("#question-catagory").html(questionCatagory);

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
                            singleDiv='<div>'+ (i+1)+". " + people[i] +'</div><hr>'
                            statsHtml += singleDiv;
                        }
                    }
                    $("#nav_content").html(statsHtml);
                })

                console.log(result);
                $("#singlePopupModal").modal({
                    show: true,
                    backdrop: false
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
                $("#errorModal").modal({
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
                $("#errorModal").modal({
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
