(function () {
  // eslint-disable-next-line no-undef
  var socket = io()
  document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault() // prevents page reloading
    const userName = document.querySelector('.user-name').innerHTML
    const input = document.querySelector('#m')
    const inputValue = input.value
    const object = {
      msg: inputValue,
      user: userName
    }
    socket.emit('chat message', object)
    input.value = ''
    return false
  })
  socket.on('chat message', function (object, timeStamp) {
    const messages = document.getElementById('messages')
    const newMessage = document.createElement('li')
    newMessage.textContent = `${object.user}: ${object.msg} ${timeStamp}`
    messages.appendChild(newMessage)
  })
})()
