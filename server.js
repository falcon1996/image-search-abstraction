var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var request = require('request');
var Bing = require('node-bing-api')({ accKey: "" });

var mongo = require('mongodb').MongoClient;

var app = express();
app.use(express.static(__dirname + '/public'));


var historySchema = new Schema({
    term: String,
    when: String
});

var History = mongoose.model('History', historySchema);


var murl = 'mongodb://localhost:27017/url-shortner';
mongoose.connect(murl);


app.get('/', function(req, res){
    res.render('index.html');
});


app.get('/search', function(req, res) {
    
    var query = req.query.q;
    var offset = req.query.offset;          //for https://img-search-api-bq.herokuapp.com/api/search?q=cats&offset=10
    
    
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        
        
        
        var history = History({
            
            "term": query,
            "when": new Date().toLocaleString()
        });
        
        
        history.save(function (err){
            
            if (err) throw err;
            
            console.log('Working!');
        });
        
    });

    
    
    Bing.images(query,{
        
        top : offset,
        skip : 0               // max can be 10
    }, function(err, resp, body){
        
        res.end(JSON.stringify(body));
    });
    
    
});


app.get('/latest', function(req, res){
    
    
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
        
        History.find({},function(err, myhistory){
            
            if (err)  throw(err);
            
            res.end(myhistory);
        });
    });
    
});



app.listen(8080,function(){
    console.log("Example of app listning on port 8080");
});