const fileSelect = document.getElementById("fileSelect"),
    fileElem = document.getElementById("fileElem"),
    fileList = document.getElementById("fileList"),
    form = document.querySelector('form')
    

if(fileSelect){
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
}   

