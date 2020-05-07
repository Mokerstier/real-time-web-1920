const upload = document.querySelector("#upload");
const msgContainer = document.querySelector(".message-container");
const message = document.getElementById("message");
const feed = document.getElementById("feed");
const feedBackMsg = ["Action unavailable: You are not signed in!"];
const listing = document.getElementById('listings')

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    console.log("Geolocation is not supported by this browser.")
  }
}
function showPosition(position) {
  console.log(position.coords)
 console.log("Latitude: " + position.coords.latitude + 
  "Longitude: " + position.coords.longitude)
}
function hasClass(elem, className) {
  return elem.classList.contains(className);
}
function createElement(tag, { options, children }) {
  const element = document.createElement(tag);

  if (options.classNames) {
    options.classNames.forEach((className) => {
      element.classList.add(className);
    });
  }
  if (options.text) {
    element.innerText = options.text;
  }
  if (options.href) {
    element.setAttribute("href", options.href);
  }
  if (options.src) {
    element.setAttribute("src", options.src);
  }
  if (children) {
    children.forEach((child) => {
      element.appendChild(child);
    });
  }
  return element;
}

(function () {
  const socket = io();
  console.log("hello");
  getLocation()
  upload.addEventListener("submit", async function (e) {
    e.preventDefault();
    let button = upload.getElementsByTagName("button")[0];

    button.setAttribute("disabled", "disabled");
    const style = [];
    const checkboxes = document.querySelectorAll("input[type=checkbox]");

    // checkboxes.forEach((checkbox) => {
    //   if (checkbox.checked === true) {
    //     console.log(checkbox);
    //     style.push(checkbox.id);
    //   }
    // });

    const geoLat = document.querySelector("#lat").value;
    const geoLon = document.querySelector("#lon").value;
    const geoTag = [geoLat, geoLon];
    const artist = document.querySelector("#artist").value;
    const formData = new FormData(uploadForm);

    fetch("/upload", {
      method: "PUT",
      body: formData,
    })
      .then((response) => {
        console.log(response);

        return response.json();
      })
      .then((data) => {
        console.log("this is parsed response " + data.url);
        photoURL = data.url;
        id = data.id;
        socket.emit("image upload", geoTag, artist, style, photoURL, id);
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally((data) => {
        button.removeAttribute("disabled");
        upload.reset();
        return false;
      });
  });

  //Update Map
  socket.on("update map", function (geoTag, artist, style, photoURL, id) {
    console.log("adding graffiti to map on location " + geoTag);
    var geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: geoTag,
          },
          properties: {
            title: artist,
            description: style,
            url: photoURL,
            id: id,
          },
        },
      ],
    };
    geojson.features.forEach(function (marker) {
      var el = document.createElement("div");
      el.className = "marker";
      const graff = marker.properties
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(`<img src="${graff.url}" alt"${graff.description} by ${graff.title} ">
                  <h3>${graff.title}</h3>
                  <p> ${graff.description}</p>
                  <a class="follow-link" href="/follow/${graff.title}">#follow artist</a>
                  <button aria-label="${graff.id}" class="king">King</button>
                  <span class="king-value">0</span>
                  <button aria-label="${graff.id}" class="toy">Toy</button>
                  <span class="toy-value">0</span>
                  `)
        )
        .addTo(map);
    });
  });
  // Update listing
  socket.on("update list", function (geoTag, artist, style, photoURL, id) {
    const link = listing.appendChild(document.createElement("a"));
    link.href = "#";
    link.classList.add("title", "link");
    link.id = "link-" + id;
    link.innerHTML = artist;
    link.data = geoTag;
    const details = listing.appendChild(document.createElement("p"));
    details.innerHTML = style;
    const img = listing.appendChild(document.createElement("img"));
    img.src = photoURL;
    img.className = "img-thumb";
  });

  //Update Feed
  socket.on("update feed", function (geoTag, artist, style, photoURL, photoID) {
    
    const title = createElement("h3", {
      options: {
        text: artist,
        classNames: ["feed_image"],
      },
    });
    const desc = createElement('p',{
      options:{
        text: style,
        classNames:['feed_style']
      }
    })
    const cover = createElement("img", {
      options: {
        src: photoURL,
        classNames: ["feed_image"],
      },
    });
    const link = createElement("a", {
      options:{
        text: '#follow artist',
        href: `/follow/${artist}`
      },
      children:[title, desc, cover]
    })
    const card = createElement("article", {
      options: {
        classNames: ["card_body"],
      },
      children: [link ],
    });
    feed.appendChild(card)
  });
  // Vote on images
  document.addEventListener(
    "click",
    function (e) {
      if (hasClass(e.target, "king")) {
        console.log(e.target);
        const photoID = e.target.getAttribute("aria-label");
        socket.emit("vote king", photoID);
      } else if (hasClass(e.target, "toy")) {
        const photoID = e.target.getAttribute("aria-label");
        socket.emit("vote toy", photoID);
      }
    },
    false
  );
  // my likes
  socket.on('my likes', function(myLikes){
    console.log(myLikes)
  })
  // my following
  socket.on('my following', function(list){
    const personal = document.querySelector('.personal-feed')
    personal.remove()
    list.forEach(element => {
      const title = createElement("h3", {
        options: {
          text: element.artist,
          classNames: ["feed_image"],
        },
      });
      const desc = createElement('p',{
        options:{
          text: element.style,
          classNames:['feed_style']
        }
      })
      const cover = createElement("img", {
        options: {
          src: element.ref,
          classNames: ["feed_image"],
        },
      });
      const link = createElement("a", {
        options:{
          text: '#unfollow',
          href: `/unfollow/${element.artist}`
        },
        children:[title, desc, cover]
      })
      const card = createElement("article", {
        options: {
          classNames: ["card_body"],
        },
        children: [link ],
      });
      feed.appendChild(card)
    });
  })
  // Update following
  document.addEventListener('click', function(e){
    if (hasClass(e.target, "follow")) {
      e.preventDefault()
      console.log(e.target.dataset.label);
      const artistName = e.target.dataset.label
      socket.emit('follow artist', artistName)
    }
  })
  socket.on('update follow', function(graffs){
    console.log(graffs)
    updateFeed(graffs)
  })
  // Update Ranks
  socket.on("update king", function (photoID, value) {
    console.log("updating");
    const voteButton = document.querySelector(".king");
    if (voteButton.getAttribute("aria-label") === photoID) {
      console.log(voteButton);
      voteButton.nextElementSibling.innerText = value;
    }
  });

  socket.on("update toy", function (photoID, value) {
    console.log("updating");
    const voteButton = document.querySelector(".toy");
    if (voteButton.getAttribute("aria-label") === photoID) {
      console.log(voteButton);
      voteButton.nextElementSibling.innerText = value;
    }
  });
  //Feedback msg
  socket.on("feedback message", function (msg) {
    const linkLogin = document.getElementById("login-link");
    const linkReg = document.getElementById("register-link");
    if (msg === 0) {
      linkLogin.href = "/login";
      linkLogin.innerText = "Login";

      linkReg.href = "/register";
      linkReg.innerText = "Register";
    }
    msgContainer.classList.add("show-msg");
    message.innerText = feedBackMsg[msg];
  });
})();


function updateFeed(list){
  list.forEach(element => {
    const title = createElement("h3", {
      options: {
        text: element.artist,
        classNames: ["feed_image"],
      },
    });
    const desc = createElement('p',{
      options:{
        text: element.style,
        classNames:['feed_style']
      }
    })
    const cover = createElement("img", {
      options: {
        src: element.ref,
        classNames: ["feed_image"],
      },
    });
    const link = createElement("a", {
      options:{
        text: '#unfollow',
        href: `/unfollow/${element.artist}`
      },
      children:[title, desc, cover]
    })
    const card = createElement("article", {
      options: {
        classNames: ["card_body"],
      },
      children: [link ],
    });
    feed.appendChild(card)
  })

}