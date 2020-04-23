const uploadForm = document.querySelector('#upload')


async function uploadFlickr(){
    const formData = new FormData(uploadForm)
    
    fetch('/upload',{
        method: 'PUT', // or 'PUT'
        body: formData,
        
    })
    .then((response) => {
        console.log(response);
        
        return response.json();
    })
    .then((data) => {
        console.log('this is parsed response '+data.message);
        url = data.message
        id = data.id
        return url
    })
    .catch((error) => {
        console.error('Error:', error);
    })
    
}