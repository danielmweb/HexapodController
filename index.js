// =========imports========
const express = require("express");
const app = express();
const fs = require("fs");
require("dotenv").config();
const path = require("path");

//use the hosting service port or the port 3000 for local hosting

// =========== Variables ============

const port = process.env.PORT || 3000;
const pathToControlUi = "/control_page/control_ui.html";
const movesPath = "moves.json";
let password = process.env.ROBOT_PASSWORD;
let moves = [];
let moveStream = "";
let command = "";
let isUp;
// ============ Configs ============
app.use(express.static(path.join(__dirname + "/landing_page")));

app.use(express.json({ limit: "1mb" })); //set express to work with json data type

app.listen(port, (error) => {
    if (error) {
        console.log("Error while starting server :/");
    } else {
        console.log("Server up");
    }
});

//============ Server Code ===========

function readMovesFile() {
    try {
        moves = fs.readFileSync(movesPath); //get json data as raw string
        moves = JSON.parse(moves); //convert it to js objects
    } catch (error) {
        console.log("Error reading moves from " + movesPath);
    }
}

readMovesFile();

console.log("Password:", password);

//=========== API =============

app.post("/check-password", (request, response) => {
    console.log("Post request received");
    let pw = request.body.password;
    if (pw === password) {
        console.log("Password accepted");
        response.setHeader("Content-Type", "text/html");
        response.sendFile(path.join(__dirname + pathToControlUi));
    } else {
        response.end();
        console.log("Password rejected");
    }
});

app.post("/save-moves", (request, response) => {
    let body = request.body; //this is an array of moves
    try {
        //save the move array received into a file
        fs.writeFileSync(movesPath, JSON.stringify(body));
        response.send("Moves saved.");
        //update the local moves array
        readMovesFile();
    } catch (error) {
        console.log(error);

        console.log("error writing to moves.json");
        response.send("Error saving moves");
    }
});

app.get("/moves", (request, response) => {
    response.json(moves);
});

app.post("/move-stream", (request, response) => {
    let body = request.body;
    console.log("moveStrings received:", body);
    moveStream = body;
    response.json(isUp);
});

app.post("/command", (request, response) => {
    let body = request.body;
    console.log("command received: ", body);
    command = body.command;
    response.send("Command saved");
});

app.get("/move-stream", (request, response) => {
    response.json(moveStream);
    moveStream = ""; //each request consumes the moveStream variable
});

app.get("/is-up", (request, response) => {
    response.send(isUp);
});

let cancel = "no";

app.get("/move-and-cancel", (request, response) => {
    let data = {
        cancel: cancel,
        moves: moveStream.moveStrings
    };
    response.json(data);
    cancel = "no";
});

app.post("/cancel", (request, response) => {
    cancel = request.body.cancel;
    console.log("Received cancel: ", cancel);
    response.end();
});

app.post("/all-data", (request, response) => {
    let data = {
        ch1: {
            hasData: false,
            jrx: 50,
            jry: 50,
            jlx: 50,
            jly: 50
        },
        ch2: {
            hasData: command != "",
            command: command
        },
        ch3: {
            hasData: moveStream != "",
            moves: moveStream.moveStrings
        }
    };

    response.json(data);
    moveStream = "";
    command = "";
    isUp = request.body;
});
