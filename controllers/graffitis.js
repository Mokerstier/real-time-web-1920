const { graffitiSchema } = require('../models/graffiti')

function getGraffs(req, res, next){
    graffitiSchema.find({}, (err, results) =>{
        if (err) throw console.error(err);
         
        res.locals.results = results
        next(null, results)
    })
}
async function getGraffsByArtist(artist){
    graffitiSchema.find({artist}, (err, results) =>{
        if (err) throw console.error(err);
        console.log(results)
        return results
    })
}
module.exports = { getGraffs, getGraffsByArtist }