var express = require('express');
var validUrl = require('valid-url');
var request = require('request');
var mongo = require('mongodb').MongoClient;
const googleIms = require('google-ims');

var app = express();
app.use(express.static(__dirname + '/public'));

var client = new googleIms('', '');


var murl = 'mongodb://localhost:27017/url-shortner';

app.get('/', function(req, res){
    res.render('index.html');
});


app.get('/search', function(req, res) {
    
    var query = req.query.q;
    var offset = req.query.offset;          //for https://img-search-api-bq.herokuapp.com/api/search?q=cats&offset=10
    
    var input = '/search?q='+query+'&offset='+offset;
    
    
    mongo.connect(murl,function(err,db){
        
        if(err) throw err;
        
        var collection = db.collect('myList');
        collection.insert({history:input},function(err, doc){
            
            if(err) throw err;
            
            console.log(JSON.stringify(doc))
            db.close()
            
        })
        
    })
    
    
    client.search(query, {
        
        page : offset,
        size : 'large',
        safe : 'off',
        fileType : 'jpg',
        googlehost: 'google.com',
        num : 1
        
    }).then(function(images){
        
        images.forEach(function(i, e, a){
            
            res.end(images);
        });
    });
    
    //res.end('Working!!!!!!!!!!!');
    
});


app.get('/latest', function(req, res){
    
    mongo.connect(murl, function(err, db){
        
        if(err) throw err;
        
        db.listCollections();
    })
    
    
})



app.listen(8080,function(){
    console.log("Example of app listning on port 8080");
});