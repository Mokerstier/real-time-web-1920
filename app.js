const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

require('dotenv').config()

const PORT = process.env.PORT


app
	.set('view engine', 'ejs')
	.set('views', 'views')
	.use(express.static(__dirname, Number('/static')))
	.get('/', function(req, res){
		res.render('pages/home.ejs')
	})

// app.listen(PORT, () => console.log(`server is gestart op port ${PORT}`))

io.on('connection', function(socket){
	
	console.log('a user connected')
	socket.on('disconnect', function(){
		console.log('user disconnected')
	})
	socket.on('chat message', function(msg){
		io.emit('chat message', msg)
		console.log('message: ' + msg)
	})

})

http.listen(PORT, function(){
	console.log(`listening on ${PORT}`)
})
  
