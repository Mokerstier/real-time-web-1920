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

function unFollow(artist, userID){
    userSchema.findById({_id: userID}, (err, user) =>{
        if (err) throw console.error(err);
        removeAllElements(user.following, artist)
        console.log(user.following)
        user.save()
    })
}

function removeAllElements(array, elem) {
    let index = array.indexOf(elem);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
    }
}
module.exports = { follow, unFollow, removeAllElements }