const closeMsg = document.querySelector('.message-container button')
const listContainer = document.querySelector('.list_container')
const listHeading = document.querySelector('.heading')


closeMsg.addEventListener('click', function (){
    msgContainer.classList.remove('show-msg')
})

listHeading.addEventListener('click', function(){
    listContainer.classList.toggle('move-list-up')
})