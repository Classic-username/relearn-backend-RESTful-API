const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

// get method is pointed at the json file, this will be different on a real database query
app.get("/listUsers", (req, res) => {
    fs.readFile(__dirname + '/' + "users.json", "utf8", (err, data) => {
        console.log(data);
        res.end(data);
    });
});

// Refactored post to be an actual post that takes the request body instead of using a hard coded value
app.post("/addUser", (req, res) => {
    // First read existing users (to make sure this user doesn't already exist)
    fs.readFile(__dirname + '/' + "users.json", "utf8", (err, data) => {
        if(err) {
            console.error("Error reading users.json:", err);
            return res.status(500).send("Internal Server Error");
        }

        const users = JSON.parse(data);
        

        // Actual check for user existing and handling
        // I don't like the use of ID because a user will never pass the ID, but for the sake of writing an actual post request instead of some silly "post" call to an endpoint that has hard coded values pre written to not actually add to the "database" I will leave it and pass the ID in the request body
        const userID = Object.keys(req.body);
        if(users[userID]) {
            return res.status(400).send("User already exists");
        }
        // Add user to the users list
        users[userID] = req.body[userID];

        console.log(req.body.user4)
        // Write the updated list to the "database" file
        fs.writeFile(__dirname + '/' + "users.json", JSON.stringify(users), "utf8", (writeErr) => {
            if(writeErr){
                console.error("error writing to the users.json:", writeErr);
                return res.status(500).send("Internal Server Error");
            }

            // Send updated data as response
            res.json(users);
            
        })
    });
});

app.get("/:id", (req, res) => {
    // Read existing users?
    fs.readFile( __dirname + '/' + "users.json", "utf8", (err, data) => {
        var users = JSON.parse(data);
        var user = users["user" + req.params.id];
        console.log(user);
        res.end(JSON.stringify(user));
    })
})

var server = app.listen(8081, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("example app listening at http://%s:%s", host, port);
});






// app.post("/addUser", (req, res) => {
//     // Read existing users to check if the user already exists
//     fs.readFile(__dirname + '/' + "users.json", "utf8", (err, data) => {
//         if (err) {
//             console.error("Error reading users.json:", err);
//             return res.status(500).send("Internal Server Error");
//         }

//         const users = JSON.parse(data);

//         // Check if user already exists
//         const userId = req.body.userId;
//         if (users[userId]) {
//             return res.status(400).send("User already exists");
//         }

//         // Add the new user dynamically using req.body
//         users[userId] = req.body;

//         // Write the updated data back to the file
//         fs.writeFile(__dirname + '/' + "users.json", JSON.stringify(users), "utf8", (writeErr) => {
//             if (writeErr) {
//                 console.error("Error writing to users.json:", writeErr);
//                 return res.status(500).send("Internal Server Error");
//             }

//             // Send the updated data as the response
//             res.json(users);
//         });
//     });
// });

// app.listen(3000, () => {
//     console.log("Server is listening on port 3000");
// });
