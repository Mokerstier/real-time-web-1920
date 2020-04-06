(function () {
  // eslint-disable-next-line no-undef
  var socket = io()
  document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault() // prevents page reloading
    var input = document.querySelector('#m')
    var inputValue = input.value
    socket.emit('chat message', inputValue)
    input.value = ''
    return false
  })
  socket.on('chat message', function (msg) {
    const messages = document.getElementById('messages')
    const newMessage = document.createElement('li')
    newMessage.textContent = msg
    messages.appendChild(newMessage)
  })
})()
