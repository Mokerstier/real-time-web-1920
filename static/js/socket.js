(function () {

  // eslint-disable-next-line no-undef
  var socket = io()
  document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault() // prevents page reloading
    //const userName = document.querySelector('.user-name').innerHTML
    const input = document.querySelector('#m')
    const msg = input.value
    
    socket.emit('chat message', msg, 10)
    // socket.emit('/target', target)
    input.value = ''
    return false
  })
  
  socket.on('chat message', function (id, msg, timeStamp, className, warrior) {
    const messages = document.getElementById('messages')
    const messageContainer = document.createElement('li')
    const newMessage = document.createElement('p')
    const timeSpan = document.createElement('span')
    const userThumb = document.createElement('img')
    userThumb.classList.add('thumb')
    userThumb.setAttribute('src', '/img/'+warrior+'.png')
    timeSpan.textContent = timeStamp
    
    messageContainer.classList.add(className)
    newMessage.textContent = `${id}: ${msg} `
    
    newMessage.appendChild(timeSpan)
    messageContainer.appendChild(userThumb)
    messageContainer.appendChild(newMessage)
    messages.appendChild(messageContainer)
    newMessage.scrollIntoView()
    
  })

  socket.on('battle message', function(id, msg ){
    const messages = document.getElementById('messages')
    const newMessage = document.createElement('li')
    newMessage.classList.add('battle-message')
    newMessage.textContent = `${msg} `
    messages.appendChild(newMessage)
    newMessage.scrollIntoView()
  })

  socket.on('server message', function(msg){
    const messages = document.getElementById('messages')
    const newMessage = document.createElement('li')
    newMessage.classList.add('server-message')
    newMessage.textContent = `${msg} `
    messages.appendChild(newMessage)
    newMessage.scrollIntoView()
  })
  socket.on('update mana', function(mana){
    const manaBar = document.querySelector('.mana-pool')
    manaBar.classList.add('mp-'+mana)
  })
  socket.on('update users', function(users){
    const memberList = document.getElementById('member-list')
    const userList = document.querySelector('#member-list ul')
    
    userList.innerHTML = ''
    users.forEach(user => {
      const userContainer = document.createElement('div')
      const userItem = document.createElement('li')
      const userHp = document.createElement('progress')
      
      userItem.textContent = user.name
      userHp.setAttribute('max', 100)
      userHp.setAttribute('value', user.hp)
      userContainer.appendChild(userItem)
      userContainer.appendChild(userHp)
      userList.appendChild(userContainer)
      
    })
    memberList.appendChild(userList)
  })
  
})()
