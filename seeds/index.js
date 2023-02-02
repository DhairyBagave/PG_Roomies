const mongoose = require('mongoose');
const cities = require('./cities');
const {places , descriptors } = require('./seedHelpers');
const pgroomies = require('../models/pgroomies');

mongoose.connect('mongodb://127.0.0.1:27017/pgroomies')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("MONGO OH NO ERROR!!!!")
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await pgroomies.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*990) + 10;
        const pg = new pgroomies({
            author : '63d670bdef7b2f501cbebdc7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`, 
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://source.unsplash.com/random/?rooms,${i}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam sint nesciunt praesentium illum porro, magni dignissimos consectetur, tempora obcaecati illo eius doloribus voluptatem maxime numquam tenetur est velit libero quibusdam?',
            price
        })
        await pg.save();
    }
    console.log("Database Connected")
}
seedDB().then(() =>{
    mongoose.connection.close();
})