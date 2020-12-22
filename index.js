const express = require("express");
const app = express();
require("dotenv").config();

const path = require("path");

//use the hosting service port or the port 3000 for local hosting
const port = process.env.PORT || 3000;

//server configs
app.use(express.static(path.join(__dirname + "/landing_page")));
app.use(express.json({ limit: "1mb" })); //set express to work with json data type

app.listen(port, (error) => {
    if (error) {
        console.log("Error while starting server :/");
    } else {
        console.log("Server up");
    }
});

//=========== API =============

//TODO: set endpoint1

let password = process.env.ROBOT_PASSWORD;
console.log("Password:", password);

app.post("/check-password", (request, response) => {
    console.log("Post request received");
    let pw = request.body.password;
    if (pw === password) {
        console.log("Password accepted");
        response.setHeader("Content-Type", "text/html");
        response.sendFile(path.join(__dirname + "/control_page/index.html"));
    } else {
        console.log("Password rejected");
    }
});
