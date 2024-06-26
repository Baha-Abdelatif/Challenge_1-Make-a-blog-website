//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const dburl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}`;

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.set('strictQuery', true);
mongoose.connect(dburl);

const postsSchema = new mongoose.Schema({
        postTitle: {
            type: String,
            required: [true, 'Please specify a post title to add']
        },
        postContent:{
          type:String,
          required:[true, 'Please specify some content']
        }
    }),
    Post = mongoose.model('Post', postsSchema),
    defaultPosts = [{
  "postTitle": "amet sem fusce consequat",
  "postContent": "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.\n\nSed ante. Vivamus tortor. Duis mattis egestas metus.\n\nAenean fermentum. Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh."
}, {
  "postTitle": "augue",
  "postContent": "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti."
}, {
  "postTitle": "natoque penatibus et",
  "postContent": "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui."
}, {
  "postTitle": "tellus",
  "postContent": "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.\n\nDuis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit."
}, {
  "postTitle": "vel",
  "postContent": "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.\n\nSed ante. Vivamus tortor. Duis mattis egestas metus."
}, {
  "postTitle": "nam",
  "postContent": "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis."
}, {
  "postTitle": "pede ac diam cras pellentesque",
  "postContent": "Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis."
}];

app.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
        if (err) {
            console.log(err);
        } else {
            if (posts.length === 0) {
                Post.insertMany(defaultPosts, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('success');
                    }
                });
                res.redirect('/');
            } else {
                res.render("home", {
    homeStartingContent,
    pageTitle: 'Home',
    posts:posts
  });
                // mongoose.connection.close();
            }
        }
    });
  
});

app.get('/about', (req, res) => {
  res.render("about", {
    aboutContent,
    pageTitle: 'About Us'
  });
});

app.get('/contact', (req, res) => {
  res.render("contact", {
    contactContent,
    pageTitle: 'Contact'
  });
});

app.get('/compose', (req, res) => {
  res.render("compose", {
    pageTitle: 'Compose'
  });
});

app.post('/compose', (req, res) => {
  const newPost = new Post({
    postTitle: req.body.composeTitle,
    postContent: req.body.composeContent
  });

  newPost.save(err=>{
    if(err){
      console.log(err);
    }else{
      console.log("success");
    }
    res.redirect('/')
  });
})

app.get('/posts/:postId', (req, res) => {
  const requestedId = req.params.postId;
  Post.findOne({
      _id: requestedId
    }, (err, post) => {
      if(err){
        console.log(err);
        res.redirect('/');
      }else{
        res.render("post", {
          pageTitle: post.postTitle,
          postTitle: post.postTitle,
          postContent: post.postContent,
          postId: post._id
        });
      }
  });
})

app.post('/delete/:postId', (req, res) => {
  const requestedId = req.params.postId;
  Post.findByIdAndRemove(requestedId, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('removed');
    };
    res.redirect('/');
  });
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});