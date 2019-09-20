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


