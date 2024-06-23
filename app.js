const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate')

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')


const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp3');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});



app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret:"thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

//Route Handlers
app.get('/',(req,res)=>{
    res.render('home')
})



app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not Found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no , Something went wrong !!';
    res.status(statusCode).render('error',{err});
})

app.listen(3000,(req,res)=>{
    console.log("LISTENING ON PORT 3000")
})