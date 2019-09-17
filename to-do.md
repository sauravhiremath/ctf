# Get all questions

## Frontend

* Score on question pallet


## On question icon click

- request JSON{qname}

- response JSON{
    qname,
    description,
    hint,
    startPoints,
    currentPoints,
    difficulty,
    type,
    solvedBy,
}

## All question for listing

- request JSON {
    username: "DevamSux"
}

- response JSON {
    baby: {
        [
            {
                qname:"sasas",
                type: "Web",
                solved: false
            },
            {
                qname: "dddd",
                type: "Pawn",
                solved: true
            }
        ] 
    },
    easy: {
        [
            {
                qname:"qqqqqq",
                type: "Cytpto",
                solved: true
            },
            {
                qname: "oooo",
                type: "Somemore",
                solved; false
            }
        ] 
    },
}

## Response sent by Saurav

* Task 2
