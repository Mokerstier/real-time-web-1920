const { userSchema } = require("../models/user");
const { graffitiSchema } = require('../models/graffiti')

async function king(photoID, userID){
    let graff = await graffitiSchema.findById(photoID)
    if(graff){
        graff.king.vote = graff.king.vote+1
        graff.king.user.push(userID)
    } else {
        console.log('something went wrong')
    }
    await user.save();
}
async function toy(photoID, userID){
    let graff = await graffitiSchema.findById(photoID)
    if(graff){
        graff.toy.vote = graff.toy.vote+1
        graff.toy.user.push(userID)
    } else {
        console.log('something went wrong')
    }
    await user.save();
}
module.exports = { king, toy }