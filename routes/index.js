function routes(){

  const render = require('../controllers/render/index')

  const express = require('express')
  const router = express.Router()
  
    
  router
    .get('/chat', render.serveChat)
    .get('/', render.serveHome)
    
  return router
}

exports.routes = routes()