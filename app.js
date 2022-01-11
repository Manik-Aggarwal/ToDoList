//jshint esversion:6
const express = require("express"),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      _ = require("lodash");
    //   date = require(__dirname + "/date.js");

    //   console.log(date());
      
const app = express();
const items=["HTML", "CSS", "JS"];
const WorkItems=[];
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your ToDoList!!"
});
const item2 = new Item({
    name: "Hit the delete button to delete!!"
});
const item3 = new Item({
    name: "Hit the + button to add!!"
});

const defaultItems = [item1,item2,item3];

const listSchema = {
    name: String,
    itemss: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function(req,res){
    Item.find({}, function(err, foundItems){
        if(foundItems.length ===0){
            Item.insertMany(defaultItems, function(err){
                if(err){console.log(err)}
                else {console.log("Successfully saved items to your database!")}
            });
            res.redirect("/");
        }
        else{
            res.render("list", {kindOfDay : "Today",newListItems : foundItems});
        }
        // console.log(foundItems);
    });
});
// app.get("/", function(req,res){
//      let day = date();
//     // let day = date.getdate();
//     res.render("list", {kindOfDay : "day",newListItems : items});
//     // res.send();
// });

app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox;
    const listname = req.body.listname;

    if(listname==="Today"){
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err){console.log("Successfully deleted checked item!!")}
            res.redirect("/");
        });
    }
    else{
        List.findOneAndUpdate({name: listname}, {$pull: {itemss:{_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listname);
            }
        });
    }
});

// app.get("/work", function(req,res){
//     res.render("list", {kindOfDay : "Work List", newListItems : WorkItems});
// });

app.get("/about", function(req,res){
    res.render("about");
});

// app.post("/work", function(req,res){
//     let item = req.body.newItem;
//     WorkItems.push(item);
//     res.redirect("/work");
// });

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}, function(err,foundList){
        if(!err){
            if(!foundList){
                //Create a new list
                const list = new List({
                    name: customListName,
                    itemss: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            }
            else{
                //show existing list
                res.render("list", {kindOfDay : foundList.name,newListItems : foundList.itemss});
            }
        }
    });
});

app.post("/", function(req,res){
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    });
    if(listName==="Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.itemss.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
    

    // console.log(req.body);
    // let item = req.body.newItem;
    // if(req.body.list==="Work"){
    //     WorkItems.push(item);
    //     res.redirect("/work");
    // }else{
    //     console.log(item);
    //     items.push(item);
    //     res.redirect("/");
    // }
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});