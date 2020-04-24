const fileSelect = document.getElementById("fileSelect"),
    fileElem = document.getElementById("fileElem"),
    fileList = document.getElementById("fileList"),
    form = document.querySelector('form')
    

fileSelect.addEventListener("click", function (e) {
  if (fileElem) {
    fileElem.click();
  }
  e.preventDefault(); // prevent navigation to "#"
}, false);

fileElem.addEventListener("change", handleFiles, false); 

function handleFiles() {
  if (!this.files.length) {
    fileList.innerHTML = "<p>No files selected!</p>";
  } else {
    fileList.innerHTML = "";
    const list = document.createElement("ul");
    fileList.appendChild(list);
    for (let i = 0; i < this.files.length; i++) {
      const li = document.createElement("li");
      list.appendChild(li);
      
      const img = document.createElement("img");
      img.classList.add("obj");
      img.file = fileElem.files
      img.src = URL.createObjectURL(this.files[i]);
      img.onload = function() {
        
        URL.revokeObjectURL(this.src);
      }
      li.appendChild(img);
      const info = document.createElement("span");
      info.innerHTML = this.files[i].name + ": " + this.files[i].size + " bytes";
      console.log(this.files[0])
      li.appendChild(info);
      
    }
  }
}
// async function sendFiles() {
//     const imgs = document.querySelectorAll(".obj")
//     for (let i = 0; i < imgs.length; i++) {
//       new FileUpload(imgs[i], fileElem.files[i]);
//     }
//   }
//   function FileUpload(img, file) {
//     const reader = new FileReader();  
//     // this.ctrl = createThrobber(img);
//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", "upload", true);
//     // xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
//     // this.xhr = xhr;
    
//     // const self = this;
//     // this.xhr.upload.addEventListener("progress", function(e) {
//     //   console.log(e)
//     //   console.log('uploading')
//     //       if (e.lengthComputable) {
//     //         const percentage = Math.round((e.loaded * 100) / e.total);
//     //         self.ctrl.update(percentage);
//     //       }
//     //     }, false);
    
//     // xhr.upload.addEventListener("load", function(e){
//     //         self.ctrl.update(100);
//     //         const canvas = self.ctrl.ctx.canvas;
//     //         canvas.parentNode.removeChild(canvas);
//     //     }, false);
        
//     data = new FormData(form)
//     console.log(data)
//     reader.onload = function(evt) {
//         console.log(data)
//       xhr.send(data);
//     };
//     console.log(file)
//     reader.readAsBinaryString(file);
    
//   }