const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ =require("lodash");
// let items = ["breakfast", "dinner"];
let workitems = [];
// let URL="mongodb+srv://anuparun81:1234@cluster0.8gy6271.mongodb.net/todolist?retryWrites=true&w=majority";
// mongoose.connect(URL);
// var db=mongoose.connection;
// db.on('error',console.error.bind(console,'connection error'));
// db.once('open',function callback(){
//     console.log("mongodb connect successfully ");
// });






const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// coonect the mongodb database
mongoose.connect("mongodb+srv://anuparun81:mongodB@cluster0.8gy6271.mongodb.net/todolistdb", { useNewUrlParser: true });

// created a name schema 
const itemsSchenma = {
    name: String

}

// createing a model name Item
const Item = mongoose.model("Item", itemsSchenma);

// create three default Item name 
const item1 = new Item({
    name: "Welcome to your todolist "
})
const item2 = new Item({
    name: "HIt the + button to add anew item "
})
const item3 = new Item({
    name: "<-- hit this to delete item "
})

// push all three intem 
const defaultItems = [item1, item2, item3];

//defining the schema for some kind of list or collection
const listSchema = {
    name: String,
    items: [itemsSchenma]
};

// createing a model name List
const List = mongoose.model("List", listSchema);

app.use(express.static("public"));

//crete  home route of get request
app.get("/", function (req, res) {

    let today = new Date();
    //  var currentday =today.getDate();
    // check if already listtitle is prsent or not
    Item.find({}).then(function (foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems).then(function () {
                console.log("Data inserted")  // Success
            }).catch(function (error) {
                console.log(error)      // Failure
            });
            res.redirect("/");
        }
        else {
            res.render("list", { listtitle: "🙏Today🙏", newListItems: foundItems });
        }
    }).catch(function (error) {
        console.log(error)      // Failure
    });


    let option = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", option);



});

 //post route of get request (add item in list)
app.post("/", function (req, res) {

    let itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName

    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }).then(function (foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);

        }).catch(function (error) {
            console.log(error)
        });
    }
});

// delete route for deleteinng item from list
app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
     const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId).then(function () {
            console.log("Checkeked item deleted"); // Success
            res.redirect("/");
        }).catch(function (error) {
            console.log(error)      // Failure
        });
    }

    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }).then(function (foundList) {

            res.redirect("/" + listName);

        }).catch(function (error) {
            console.log(error)
        });
    }

    //************ */
    // Item.findByIdAndRemove(checkedItemId).then(function () {
    //             console.log("Checkeked item deleted"); // Success
    //             res.redirect("/");
    //         })
    
   
      
});

// route for customlist name
app.get("/:customListName", function (req, res) {
     const customListName =_.capitalize(req.params.customListName);
    // const customListName = (req.params.customListName);

    List.findOne({ name: customListName }).then(function (foundList) {
        if (!foundList) {
            const list = new List({
                name: customListName,
                items: defaultItems
            });
            list.save();
            res.redirect("/" + customListName);
        }

        else {
            res.render("list", { listtitle: foundList.name, newListItems: foundList.items });
        }
    }).catch(function (error) {
        console.log(error)      // Failure
    });


});

app.get("/work", function (req, res) {
    res.render("list", { listtitle: "work list", newListItems: workitems });
})

app.post("/work", function (req, res) {
    let item = req.body.newitem;
    workitems.push(item);
    res.redirect("/work");
})
app.get("/about", function (req, res) {

    res.render("about");
})

// route for local host connection
app.listen(3000, function () {
    console.log("server is running on port 3000 ");
})





/*
rough work

mongodb+srv://anuparun81:1234@cluster0.8gy6271.mongodb.net/todolist?retryWrites=true&w=majority





*/