const Campground = require('../models/campground')
const indianCities = require('./cities')
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
    for(let i=0; i < 200 ;i++){
        const random1000 = Math.floor(Math.random()*1000)
        // const random100 = Math.floor(random1000/10);
        const price = Math.floor(Math.random()*20);
        const camp = new Campground({
            author:"6682241b820b9dbb191d2281",
            title:`${sample(descriptors)} ${sample(places)}`,
            location:`${indianCities[random1000].city}, ${indianCities[random1000].state}`,
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex nesciunt consectetur quidem eius, dolorum amet rerum harum ad ipsum exercitationem asperiores earum. Ea veritatis enim dolores, aspernatur nemo doloremque neque!",
            price:price,
            geometry: {
              type: 'Point',
              coordinates: [ 
                indianCities[random1000].longitude,
                indianCities[random1000].latitude
              ] 
            },
            images:[
              {
                url: 'https://res.cloudinary.com/diy2jq8ef/image/upload/v1720101986/YelpCamp-Complete/xsyj7nzjlkohj8pzl6du.jpg',
                filename: 'YelpCamp-Complete/xsyj7nzjlkohj8pzl6du',
              },
              {
                url: 'https://res.cloudinary.com/diy2jq8ef/image/upload/v1720110683/YelpCamp-Complete/tghg7df3qtou1j3se0rb.jpg',
                filename: 'YelpCamp-Complete/tghg7df3qtou1j3se0rb',
              }
              ] 
        })
        await camp.save();
    }
}

seedDB()
    .then(()=>{
        mongoose.connection.close()
    })
