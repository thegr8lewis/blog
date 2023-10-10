const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');

// express app
const app = express();

//connect to mongodb
const dbURI = 'mongodb+srv://lewis:lewis123@cluster0.hrgtju2.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then((results)=>app.listen(8000))
  .catch((err)=>console.log('err'))


//middleware & static
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));

// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'my views');


//routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});


//blog routes
app.get('/blogs', (req, res) => {
  Blog.find().sort({createdAt:-1})
    .then((result)=>{
      res.render('index', {title:'all blog', blogs:result})
    })
    .catch((err)=>{
      console.log(err);
    })
});


app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

app.post('/blogs',(req,res)=>{
    const blog =new Blog(req.body);
    blog.save()
    .then((result)=>{
      res.redirect('/blogs');
    })
    .catch((err)=>{
      console.log(err);
    })
})

app.get('/blogs/:id', (req,res)=>{
  const id = req.params.id;
  Blog.findById(id)
  .then((result)=>{
    res.render('details', {blog:result, title:'blog Details'})
  })
  .catch((err)=>{
    console.log(err);
  })
})

app.delete('/blogs/:id', (req,res)=>{
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
  .then(result=>{
    res.json({redirect:'/blogs'})
  })
})

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});