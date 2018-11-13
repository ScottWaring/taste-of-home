document.addEventListener("DOMContentLoaded", init)
let BASE_USER_URL = 'http://localhost:3000/users'
let BASE_SEARCH_URL = 'http://localhost:3000/search'
let formInput = document.querySelector('form')
let content = document.getElementById('content-box')
let userDisplay = document.getElementById("user-display")

/// function to fetch and add users reviews to their profile
function renderUserReviews(userId) {
  let userReviews = document.getElementById("user-reviews")
  userReviews.innerHTML += "You Have No Reviews Yet"
}

///function to fetch and add users favorites to their profile
function renderUserFavorites(userId) {
  let userFavorites = document.getElementById("user-favorites")
  userFavorites.innerHTML += "You Have No Favorites Yet"
}


///funtion to show user page
function displayUser(user) {
  let userId = user.id
  userDisplay.innerHTML= `Logged In As: ${user.name}`
  content.innerHTML = `<div id="user-div">
  <div id="user-info">
    <h3>${user.name}</h3>
    <h4>Memeber Since: ${user.created_at}</h4>
  </div>
  <div id="user-favorites">Favorites: </div>
  <div id="user-reviews">Reviews: </div>
  </div>`
  renderUserReviews(userId)
  renderUserFavorites(userId)
}


///function to fetch user from backend
function fetchUser(userName, passWord) {
  let body = {
    name: userName,
    password: passWord
  }
  fetch(BASE_USER_URL, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
  .then(function(response) {
    return response.json()
  })
  .then(function(userObject) {
    displayUser(userObject)
  })
}

/// function to log in or create users
function createOrLogIn() {
  content.innerHTML = `<div id="add-user-form-div">
    <form id="add-or-create-user">
      <input type="text" name="user-name" placeholder="Name" value=""><br>
      <input type="password" name="password" placeholder="Password" value=""><br>
      <input type="submit" value="Log In">
    </form>
  </div>`
  let userForm = document.getElementById("add-or-create-user")
  userForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let userName = event.target[0].value
    let password = event.target[1].value
    fetchUser(userName, password)
  })
}


///function to create review form
function createReview(id) {
  let showForm = document.getElementById(`display-reviews-box-${id}`)
  showForm.innerHTML += `<form id="add-review-form">
  <input type="text" name="Title" placeholder="Review Title" value="">
  <textarea name="Review Content" placeholder="Review Content Here" value=""></textarea>
  <input type="submit" name="Submit Review">
  </form>`
  showForm.addEventListener("submit", (event) => {
    event.preventDefault()
    console.log(user)
    showForm.innerHTML = ""
  })
}

/////button creation
window.addEventListener("click", (event) => {
  if (event.target.className === "add-review-tag") {
    let businessId = event.target.parentElement.dataset.id
    createReview(businessId)
  }
  if (event.target.id === "user-display") {
    createOrLogIn()
  }
})

////search bar value
formInput.addEventListener('submit', (event) => {
  event.preventDefault()
  let input = event.target.children[0].value
  let input_location = event.target.children[1].value
  formatYelpBody(input, input_location)
})

////structure body for yelp fetch
function formatYelpBody(input, location_input) {
  let body = {
      term: input,
      categories: "market,supermarket,grocery,grocer"
    }
  if (location_input === "" ) {
    let latLongAssign = new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(
        function success(position) {
          body.longitude = position.coords.longitude;
          body.latitude = position.coords.latitude;
          resolve(body)
        }
    )}).then((body) => callYelp(body))
  } else {
    body.location = location_input
    callYelp(body)
  }
}

///fetch from yelp via rails (backend)
function callYelp(body) {
  let url = BASE_SEARCH_URL
  fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
.then(function(response) {
  return response.json()
})
.then(function(responseJson){
  renderResultsToPage(responseJson)
})
}


///function to output results to page
function renderResultsToPage(results) {
  content.innerHTML = ""
  const busArr = results.businesses
  for(place of busArr) {
    console.log(place)
    content.innerHTML += `<div data-id="${place.id}" class="business-box">
    <div class="business-thumbnail"><img height="20%" width="20%" src="${place.image_url}"></div>
      <div class="business-info">
        <h4><a href="${place.url}">${place.name}</a></h4>
        <p>${place.location.display_address.join(" ")}</p>
        <p><a href="tel:${place.phone}">${place.display_phone}</a></p>
      </div>
      <p class="see-reviews-tag">See Reviews</p>
      <p class="add-review-tag">Add Review</p>
      <p class="favorite-tag">Favorite</p>
      <div id="display-reviews-box-${place.id}"></div>
    </div>`
  }
}

///fetch from local db
function init() {
  userDisplay.innerHTML = "Please Log In Or Create Account";
  content.innerHTML = '<img id="image-placeholder" src="images/noodles.jpeg">'
}
