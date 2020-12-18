const express = require("express");
const app = express();

const path = require("path");

//use the hosting service port or the port 3000 for local hosting
const port = process.env.PORT || 3000;

app.listen(port, (error) => {
    if (error) {
        console.log("Error while starting server :/");
    } else {
        console.log("Server up");
    }
});

app.use(express.static(path.join(__dirname + "/client"))); //deliver entry page
app.use(express.json({ limit: "1mb" })); //set express to work with json data type

//=========== API =============

//TODO: set endpoint1

// app.get("/", (request, response) => {
//     response.sendFile(path.join(__dirname + "/client/index.html"));
// });

app.get("/test", (request, response) => {
    console.log("Request: ", request.body);
    response.end();
});

app.post("/test", (request, response) => {
    console.log("Posted: ", request.body);
    response.json({
        msg: "This came from the server as a response to your post request"
    });
});
