// jshint eversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date");

const app = express();

let items = ["Eat", "Sleep", "Study", "Repeat"];
let workItems = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/", function (request, response) {
    const day = date.getDate();

    response.render("list", {listTitle: day, listItems: items});
});

app.post("/", function(req, res){
    console.log(req.body.newItem); 
    console.log(req.body);

    if(req.body.buttonOfList === "Work"){
        const workItem = req.body.newItem;
        workItems.push(workItem);

        res.redirect("/work");
    }
    else{
        const item = req.body.newItem; 
        items.push(item);
        
        res.redirect("/");
    }
})

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", listItems: workItems});
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Started At Port 3000.");
});