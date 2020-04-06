const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const moment = require('moment')
moment.locale('nl')

require('dotenv').config()

const PORT = process.env.PORT
const { routes } = require('./routes/index')

app
  .set('view engine', 'ejs')
  .set('views', 'views')
  .use(express.static(__dirname + '/static'))
  .use('/', routes)
	

// app.listen(PORT, () => console.log(`server is gestart op port ${PORT}`))

io.on('connection', function(socket){
	
  console.log('a user connected')
  socket.on('disconnect', function(){
    console.log('user disconnected')
  })
  socket.on('chat message', function(object) { 
    const timeStamp = moment().format('LT')
	
    io.emit('chat message', object, timeStamp)
    console.log('message: ' + object)
  })

})

http.listen(PORT, function(){
  console.log(`listening on ${PORT}`)
})
  
