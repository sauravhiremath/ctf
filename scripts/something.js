function x(nameOfChallenge, username) {
    var found;
    var doc = db.challenges.findOne({
        name: nameOfChallenge
    });

    for (var i = 0; i < doc.solvedBy.length; i++) {
        if (doc.solvedBy[i].username === username) {
            found = i;
            break;
        }
    }
    doc.solvedBy.splice(found, 1);
    // print(doc.solvedBy.map(function (z) {
    //     return z["username"]
    // }));
    db.challenges.save(doc);
}

function mongoAdd(name, description, type, difficulty, answer, startPoints ) {
    db.challenges.insertOne({
        name: name,
        description: description,
        type: type,
        difficulty: difficulty,
        hint: "",
        answer: answer,
        startPoints: startPoints,
        currentPoints: startPoints,
        solvedBy: [],
        hidden: "",
    });
}

mongoAdd("MS Powerpoint", "Remeber Red, hope is a good thing, maybe the best of things, and no good thing ever dies<br><br>Server: nc ctf-xp.ctfvit.com 2002", "Jail", "medium", "ctfCTF{W0w_y0u_3sC4p3d_Th4_B4sH_J41L}", 250)

mongoAdd("MS Excel", "Good God, man. Do you really believe I haven't thought about that too?<br><br>Server: nc ctf-xp.ctfvit.com 2004", "Jail", "medium", "ctfCTF{Sh0ulD_h4ve_bL0cK3d_func_code}", 250)

mongoAdd("MSN", "Control can sometimes be an illusion, but sometimes you need illusion to gain control.<br><br><a href='http://ctf-xp.ctfvit.com:2005'>http://ctf-xp.ctfvit.com:2005</a>", "Web", "easy", "ctfCTF{G00d_jo8_wiTH_th1S_w3B_Ch4llenG3}", 150)

mongoAdd("E-Mail", "The concept of waiting bewilders me. There are always deadlines. There are always ticking clocks.<br><br><a href='http://ctf-xp.ctfvit.com:2006'>http://ctf-xp.ctfvit.com:2006</a>", "Web", "easy", "ctfCTF{454455454}", 110)

mongoAdd("Key", "That's a made up name. What is your real name?<br />Ladis.<br />Ladis what?<br />Ladis Washirum.<br />So your name is like the sign, Ladies' Washroom.<br />Oh.<br />That is a made up name.<br /><br><a href='https://ctf.ctfvit.com/challenges/subs_cipher.zip'>https://ctf.ctfvit.com/challenges/subs_cipher.zip</a>", "Cryptography", "hard", "ctfCTF{insovietrussiapikachucatchesyou}", 380)

mongoAdd("Notepad", "I was in Oklahoma last week.<br><br><a href='http://ctf-xp.ctfvit.com:2007/'>http://ctf-xp.ctfvit.com:2007/</a>", "Web", "medium", "ctfCTF{th3_t0rn4D0_BL3w_m3_4w4y}", 230)
