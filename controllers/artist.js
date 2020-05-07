const { userSchema } = require("../models/user");

function follow(artist, userID){

    userSchema.findById({_id: userID}, (err, user) =>{
        if (err) throw console.error(err);
        
        console.log(user.following) 
        user.following.push(artist)
        console.log(user.following)
        
        user.save()
        
    })
}
module.exports = { follow }