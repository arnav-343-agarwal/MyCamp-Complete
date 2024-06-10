const express = require('express')
const app = express()
const path = require('path')

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')

const ejsMate = require('ejs-mate')
const {campgroundSchema} = require('./schemas')
const Campground = require('./models/campground')
const methodOverride = require('method-override')

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

const validateCampground = (req,res,next)=>{  
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}


//Route Handlers
app.get('/',(req,res)=>{
    res.render('home')
})


app.get('/campgrounds',catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds});
}))
app.post('/campgrounds',validateCampground, catchAsync(async(req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground data',400);
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))


app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})


app.get('/campgrounds/:id',catchAsync(async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground})
}))
app.put('/campgrounds/:id',validateCampground, catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body.campground,{runValidators:true,new:true})
    res.redirect(`/campgrounds/${id}`);
}))
app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))


app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit',{campground});
}))


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