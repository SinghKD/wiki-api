const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

/////////////////for all articles/////////////////////////////////////////

app.route("/articles")

.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(err)
            res.send(err);
        else
            res.send(foundArticles);
    })
})  

.post(function(req, res){
    
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err)
            res.send("Success!");
        else
            res.send("lol");
    })
})

.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err)
            console.log("success");
        else    
            console.log("lol"); 
    })
});


///////////////////for a specific article////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){

    Article.findOne({title: req.params.articleTitle}, function(req, foundArticle){
        if(foundArticle)
            res.send(foundArticle);
        else
            res.send("lol try again");
    })
})

.put(function(req, res){

    Article.update({title: req.params.articleTitle},
                    {title: req.body.title, content: req.body.content},
                    {overwrite: true},
                    function(err){
                        if(!err)
                            res.send("Success!")
                        else
                            res.send("lol try again")   
                    })
})

.patch(function(req, res){
   
    Article.update({title: req.params.articleTitle},
                    {$set: req.body},
                    function(err){
                        if(!err)
                            res.send("Success!");
                        else
                            res.send(err);
                    });
})

.delete(function(req, res){
    
    Article.deleteOne({title: req.params.articleTitle}, function(err){
        if(!err)
            res.send("Success!");
        else
            res.send(err);
    })
});





app.listen(3000, function(){
    console.log("Server up and running!")
})                              

