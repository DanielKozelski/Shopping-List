const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

//mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://RushM0re:RushM0re@cluster0-vmmmy.mongodb.net/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true });


const itemSchema = {
    name: String
};

const Item = mongoose.model('Item', itemSchema);

app.get('/', (req, res)=>{
    let today = new Date();

    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    
    let day = today.toLocaleDateString("en-US", options);

    Item.find({}, function(error, fetchedItems){
        console.log(fetchedItems);
        res.render('index', {
            listTitle: day,
            newListItems: fetchedItems
        });
    });
});

app.post('/', (req, res)=>{
    console.log(req.body.list);
    let userInput = req.body.newItem;

    const item = new Item({
        name: userInput
    });

    item.save();
    res.redirect('/');
   
});

app.post('/delete', (req, res) => {
    console.log(req.body.checkbox);
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function(error) {
        if(!error){
            console.log("Item has been deleted");
            res.redirect('/');
        }
    });
});

app.listen(process.env.PORT || port, function(){
    console.log("Server is running on port " + port);
})