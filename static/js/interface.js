const closeMsg = document.querySelector('.message-container button')

closeMsg.addEventListener('click', function (){
    msgContainer.classList.remove('show-msg')
})