let bodyParser = require('body-parser');
let mongoose = require('mongoose');

//Connect to Database
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://test:test12@ds141221.mlab.com:41221/todo-app',{useNewUrlParser: true});

//create a schema (Blueprint)
let todoSchema = new mongoose.Schema({
    item:String
});

let Todo = mongoose.model('Todo', todoSchema);


//middleware used in post request
let urlEncodedParser = bodyParser.urlencoded({extended: false});


module.exports = function(app){

    app.get('/todo', function(req,res){
        //get data from mongodb and pass it to view
        Todo.find({}, function(err,data){
            if (err) throw err;
            res.render('todo',{todos: data});
        });
    });
    
    
    app.post('/todo', urlEncodedParser, function(req,res){
        // get data from the view and add it to mongoDB
        let newTodo = Todo(req.body).save(function(err,data){
            if(err) throw err;
            res.json(data);
        })
   });
    
    app.delete('/todo/:item', function(req,res){

        //delete the requested item from mongodb

        Todo.find({item: req.params.item.replace(/\-/g," ")}).remove(function(err,data){
            if(err) throw err;
            res.json(data);
        });
            
    });
};