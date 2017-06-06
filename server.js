var express = require('express');
var request = require('request');
var Bing = require('node-bing-api')({ accKey: "" });        //Add Acc Key Here!

var mongo = require('mongodb').MongoClient;

var app = express();
app.use(express.static(__dirname + '/public'));

var murl = 'mongodb://localhost:27017/url-shortner';



app.get('/', function(req, res){
    res.render('index.html');
});


app.get('/search', function(req, res) {
    
    var query = req.query.q;
    var offset = req.query.offset;          
    
    mongo.connect(murl,function(err,db){
        
        if(err) throw err;
        
        var collection = db.collection('history');
        
        var doc = {
            term: query,
            when: new Date().toString(),
            flag:1
        };
        
        collection.insert(doc, function(err, data){
            
            if(err) throw err;
            
            console.log('data inserted!!')
            db.close();
        });
        
    });
    

    
    Bing.images(query,{
        
        top : offset,
        skip : 0                    // max can be 10
    }, function(err, resp, body){
        
        res.end(JSON.stringify(body));
    });
    
    
});


app.get('/latest/imagesearch', function(req, res){
    
    mongo.connect(murl, function(err,db){
        
        if(err) throw err;
        
        var collection = db.collection('history');
        
        collection.find({flag : 1}).toArray(function(err,documents){
            
            if(err) throw err;
            
            db.close();
            console.log(documents)
            res.send(JSON.stringify(documents))
            
        });
    });
    
});



app.listen(8080,function(){
    console.log("Example of app listning on port 8080");
});