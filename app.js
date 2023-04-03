// jshint eversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date");
const _ = require("lodash");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set("view engine", "ejs");

const mongoose = require("mongoose");
// mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');
mongoose.connect("mongodb+srv://admin-dipayan:Test123@cluster0.9m2ribu.mongodb.net/todolistDB");


const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name Is Mandatory & It Is Missing'
    }
});

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name Is Mandatory & It Is Missing'
    },
    items: [itemsSchema]
});

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);


const item1 = new Item({
    name: "Eat"
});
const item2 = new Item({
    name: "Sleep"
});
const item3 = new Item({
    name: "Study"
});
const item4 = new Item({
    name: "Repeat"
});

const defaultItems = [item1, item2, item3, item4];


app.get("/", function (request, response) {
    
    //let day = date.getDate();

    Item.find().then(function (allItems) 
    {
        if(allItems.length === 0)
        {
            try
            {
                
                Item.insertMany(defaultItems).then(function(doc){
                    console.log("Success!");
                    // console.log(doc);
                    response.redirect("/");
                });
            } 
            catch(error)
            {
                console.log(error);
            } 
        }
        else
        {
            response.render("list", {listTitle: "Today", listItems: allItems});
        }  
    });
});


app.get("/list/:customListName", function(req, res){

    //console.log(req.params.customListName);

    const customListName = _.capitalize(req.params.customListName);
    console.log(customListName);

    try 
    {
        List.findOne({name: customListName}).then(function(foundList){
            if(!foundList)
            {
                console.log("Doesn't Exists");

                const newList = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                List.create(newList);
                res.redirect("/list/" + customListName);
            }
            else
            {
                console.log("Exists");

                res.render("list", {listTitle: foundList.name, listItems: foundList.items});
            }
        });    
    } 
    catch (error) 
    {
        console.log(error);
    }
});


app.post("/", function (req, res) {

    //console.log(req.body.newItem); 
    //console.log(req.body);

    const itemName = req.body.newItem;
    const listName = req.body.buttonOfList;
    
    console.log(listName);

    const newItem = new Item({
        name: itemName
    });

    if (listName === "Today")
    {
        Item.create(newItem);
        res.redirect("/"); 
    } 
    else 
    {
        try 
        {
            List.findOne({name: listName}).then(function(listFound){
                listFound.items.push(newItem);
                listFound.save();
                res.redirect("/list/" + listName);
            });
        } 
        catch (error) 
        {
            console.log(error);
        }      
    }
});


app.post("/delete", function(req, res){
  
    checkedItemId = req.body.checkbox;
    nameOfList = req.body.listName;
   
   if(nameOfList === "Today")
   {
        Item.findByIdAndRemove(checkedItemId).then(function(){
        console.log("Success!!!");
        res.redirect("/");
       });
   }
   else
   {
        try 
        {
            List.findOneAndUpdate({name: nameOfList}, {$pull: {items: {_id: checkedItemId}}}).then(function(){
                    res.redirect("/list/" + nameOfList);
            });    
        } 
        catch (error) 
        {
            console.log(error);    
        }
   }
   
});


const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("Server Started At Port 3000.");
});