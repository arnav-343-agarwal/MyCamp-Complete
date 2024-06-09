const Campground = require('../models/campground')
const cities = require('./cities')
const {descriptors,places} = require('./seedHelpers')
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp3');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async()=>{
    await Campground.deleteMany({})
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20);
        const camp = new Campground({
            title:`${sample(descriptors)} ${sample(places)}`,
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            image:"https://source.unsplash.com/random/?camping",
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex nesciunt consectetur quidem eius, dolorum amet rerum harum ad ipsum exercitationem asperiores earum. Ea veritatis enim dolores, aspernatur nemo doloremque neque!",
            price:price
        })
        await camp.save();
    }
}

seedDB()
    .then(()=>{
        mongoose.connection.close()
    })
