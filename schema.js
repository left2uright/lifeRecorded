var gridSchema = {
    "name": "grid",

    properties: {

        "id": {
            "type": "Integer",
            "length": 10

            "properties": {
                "row": {
                    "type": "Array",
                    "length": 20,

                    "properties": {
                        "cell": {
                            "type": "Integer",
                            "length": 1
                        }
                    }
                }
            }
        }
    }
}

var recordSchema = {
    "name": "leaderboard",

    "properties": {
        "id": {
            "type": "Integer",
            "length": 10,

            "properties": {
                "value": {
                    "type": "Integer"
                    "length": 10
                }
            }
        }
    }
}
