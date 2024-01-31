var express = require("express");
var app = express();
var fs = require("fs");

// hard coding a user to add for some reason
var user = {
    "user4" : {
        "name" : "mohit",
        "passwod" : "password4",
        "profession" : "teacher",
        "id" : 4
    }
}

// get method is pointed at the json file, this will be different on a real database query
app.get("/listUsers", (req, res) => {
    fs.readFile(__dirname + '/' + "users.json", "utf8", (err, data) => {
        console.log(data);
        res.end(data);
    });
});

// post for the user hard coded above
app.post("/addUser", (req, res) => {
    // First read existing users (to make sure this user doesn't already exist)
    fs.readFile(__dirname + '/' + "users.json", "utf8", (err, data) => {
        data = JSON.parse(data);
        // this line below should be doing something like req.body or req.header to add user4 to the data, but instead it's passing the hard coded value from the top of the file
        data["user4"] = user["user4"];
        console.log(data);
        res.end(JSON.stringify(data));
    });
});

var server = app.listen(8081, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("example app listening at http://%s:%s", host, port);
});