const { userSchema } = require("../models/user");
const { graffitiSchema } = require('../models/graffiti')

async function king(photoID, userID){
    let graff = await graffitiSchema.findById(photoID)
    if(graff){
        if(graff.king.includes(userID)){
            const index = graff.king.indexOf(userID);
            if (index > -1) {
                graff.king.splice(index, 1);
            }
        } else {
            graff.king.push(userID)
        }
    } else {
        console.log('something went wrong')
    }
    let user = await userSchema.findById(userID)
    if(user){
        user.liked.push(photoID)
    } else {
        console.log('something went wrong')
    }
    await graff.save();
    await user.save();
    return graff.king.length
}
async function toy(photoID, userID){
    let graff = await graffitiSchema.findById(photoID)
    if(graff){
        if(graff.toy.includes(userID)){
            const index = graff.toy.indexOf(userID);
            if (index > -1) {
                graff.toy.splice(index, 1);
            }
        } else {
            graff.toy.push(userID)
        }
    } else {
        console.log('something went wrong')
    }
    let user = await userSchema.findById(userID)
    if(user){
        if(user.disliked.includes(photoID)){
            const index = user.disliked.indexOf(photoID);
            if (index > -1) {
                user.disliked.splice(index, 1);
            }
        } else {
            user.disliked.push(photoID)
        }
    } else {
        console.log('something went wrong')
    }
    await graff.save();
    await user.save();
    return graff.toy.length
}
module.exports = { king, toy }