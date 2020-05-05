const { userSchema } = require("../models/user");

async function artist(req, res){
    const userID = req.user
    userSchema.findById({_id: userID}, (err, user) =>{
        if (err) throw console.error(err);
        
        console.log(user.following) 
        user.following.push(req.params.artist)
        console.log(user.following)
        
        user.save()

        
    })
}
module.exports = { artist }