let express = require("express");

let app = express();

app.use(express.static("public"));

app.use("/css", express.static(__dirname + "/public/css"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/image", express.static(__dirname + "/public/image"));

let server = app.listen(9005, () => {
    let port = server.address().port;
    console.log("Server started at http://localhost:%s", port); 
});


    // "start": "node server.js"
    // "run": "live-server"