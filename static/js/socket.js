(function () {
  // eslint-disable-next-line no-undef
  var socket = io()
  document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault() // prevents page reloading
    
    const input = document.querySelector('#m')
    const inputValue = input.value
    socket.emit('chat message', inputValue)
    input.value = ''
    return false
  })
  socket.on('chat message', function (msg) {
    const userName = document.querySelector('.user-name').innerHTML
    const messages = document.getElementById('messages')
    const newMessage = document.createElement('li')
    newMessage.textContent = `${userName}: ${msg}`
    messages.appendChild(newMessage)
  })
})()
