const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true })
const moment = require('moment')
moment.locale('nl')
// moment.tz.setDefault('Europe/Amsterdam')

require('dotenv').config()

const PORT = process.env.PORT

function User(name, hp, mp, warrior)  {
  this.name = name
  this.hp = hp
  this.mp = mp
  this.warrior = warrior
}

const randomGreet = [
  'Sharpen your words for a new challenger appeared: ',
  'You know who is ready for some epic chat-battle?? ',
  'Get ready for this next underlord called: ',
  'You know this challenger?: ',
  'Get ready to smash your keyboard for: '
]
let warrior
let user 
let users = []

app
  .set('view engine', 'ejs')
  .set('views', 'views')
  .use(express.static(__dirname + '/static'))
  .use(urlencodedParser)
  .post('/chat', (req, res) => {
    user = req.body.fname
    warrior = req.body.warrior
    res.render('pages/chat.ejs', {
      title: 'Keyboard Warrior || Battle',
      pagemsg: 'This is the beginning of your battle',
      user: req.query.fname
    })
  })

  .get('/', (req, res) =>{
    res.render('pages/home.ejs', {
      title: 'Keyboard Warrior',
      pagemsg: 'Welcome to the socket chat-battle service'
    })
  })

	

// app.listen(PORT, () => console.log(`server is gestart op port ${PORT}`))

io.on('connection', function(socket){
  user = new User(user, 100, 0, warrior)
  let nickName = user.name
  const timeStamp = moment().format('LT')
  // user.hp = 100
  users.push(user)
  socket.user = user
  let randomInt = Math.floor(Math.random() * 6)
  //connect
  console.log(`a user with id ${nickName} connected`)

  // Server message
  socket.emit('server message', `SERVER: welcome to the server ${nickName}.`)
  socket.emit('server message', 'With certain commands you can perform actions againts other users')
  socket.emit('server message', 'Type: "/commands" to get a list of commands')
  socket.broadcast.emit('server message', `SERVER: ${randomGreet[randomInt]} ${nickName}.`)
  
  io.emit('update users', users)
  
  //disconnect
  socket.on('disconnect', function(){
    
    users = users.filter(User => {if(User.name !== nickName) return User})
   
    io.emit('update users', users)
    // Server message
    socket.broadcast.emit('server message', `SERVER: user ${nickName} has disconnected.`, timeStamp)
    console.log(`a user with nick-name ${nickName} disconnected`)
  })

  socket.on('chat message', function(msg, mg) { 
    if(msg.includes('/commands')){
      socket.emit('server message', 'Possible commands are: "/target {target name}" attack a desired target, "/special {target name}" perform a special move on your target, "/heal" can be used to regain some HP ')
    } 
    // Special attack
    else if(msg.includes('/special')){
      const target = msg.slice(9)
      if (socket.user.mp < 50){
        socket.emit('battle message', null, 'You dont have enough mana to perform this kind of move')
      } else {
        users.filter(user => {if(user.name === target) user.hp = 0})
        io.emit('update users', users)
        socket.user.mp = 0
        socket.emit('update mana', socket.user.mp)
        socket.emit('battle message','SERVER: ','You destroyed '+target)
        socket.broadcast.emit('battle message','SERVER: ',socket.user.name+' destroyed: '+target+' with a special move')  
      }
    } 
    // Heal
    else if(msg.includes('/heal')){
      if(socket.user.mp == 0){
        socket.emit('battle message', null, 'You dont have any mp get some by chatting first!')    
      }else {
        socket.user.hp = socket.user.hp + socket.user.mp
        console.log(socket.user)
        io.emit('update users', users)
        socket.emit('battle message', null, `You restored ${socket.user.mp} health points!`)
        
        socket.user.mp = 0
        socket.emit('update mana', socket.user.mp)
      }
    } 
    // Target attack
    else if(msg.includes('/target')){
      if(socket.user.hp <= 0){
        socket.emit('battle message', null, 'You dont have any hp restore your heatlh first!')
      }
      else if(socket.user.mp == 0){
        socket.emit('battle message', null, 'You dont have any mp get some by chatting first!')    
      } else {
        const target = msg.slice(8)
        let dmg = socket.user.mp
        users.filter(user => {if(user.name === target) user.hp = user.hp - dmg})
        socket.user.mp = 0
        io.emit('update users', users)
        socket.emit('update mana', socket.user.mp)
        socket.emit('battle message','SERVER: ','You struck '+target+' with '+dmg+' damage')
        socket.broadcast.emit('battle message','SERVER: ',socket.user.name+' targeted: '+target+' with a stunning '+dmg+' damage!')
      }
    } else {
      warrior = socket.user.warrior
      const timeStamp = moment().format('LT')
      socket.emit('chat message','You', msg, timeStamp, 'me', warrior)
      socket.broadcast.emit('chat message', nickName, msg, timeStamp, 'other', warrior) 
      socket.user.mp = socket.user.mp + mg
      socket.emit('update mana', socket.user.mp)
    }
    
    if(socket.user.mp >= 50){
      socket.emit('battle message','You','Special move active!')
    }

  })

})

http.listen(PORT, function(){
  console.log(`listening on ${PORT}`)
})
  
