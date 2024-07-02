const Campground = require('../models/campground');

module.exports.index =  async(req,res)=>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds});
}
module.exports.renderNewForm = (req,res)=>{
    // console.log(req.user , req.isAuthenticated());
    res.render('campgrounds/new');
}
module.exports.createCampground = async(req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground data',400);
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id;
    await campground.save();
    req.flash('success',"Successfully made a new Campground");
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.showCampground = async(req,res,next)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    // console.log(campground);
    if(!campground){
        req.flash('error',"Cant't find Campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
}
module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error',"Cant't find Campground");
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}
module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,req.body.campground,{runValidators:true,new:true});
    req.flash('success',"Successfully Updated the campground");
    res.redirect(`/campgrounds/${id}`);
}
module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Campground');
    res.redirect('/campgrounds')
}
