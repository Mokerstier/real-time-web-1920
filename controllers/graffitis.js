const { graffitiSchema } = require('../models/graffiti')

function getGraffs(req, res, next){
    graffitiSchema.find({}, (err, results) =>{
        if (err) throw console.error(err);
         
        res.locals.results = results
        next(null, results)
    })
}
module.exports = { getGraffs }