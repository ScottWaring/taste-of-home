
//////////**** Global Variables ************************************

document.addEventListener("DOMContentLoaded", init)
let BASE_USER_URL = 'http://localhost:3000/users'
let BASE_SEARCH_URL = 'http://localhost:3000/search'
let BASE_FAVORITE_URL = 'http://localhost:3000/favorites'
let BASE_REVIEW_URL = 'http://localhost:3000/reviews'
let formInput = document.querySelector('form')
let content = document.getElementById('content-box')
let userDisplay = document.getElementById("user-display")
let userStore = {favorites: [], reviews:[]}

///////////////////////////////////////////////////////////////////////////
///////    ********* Favorite -- Functions ********************

// function to fetch and delete instance of favorite ---------------------- FF
function deleteFavorite(favoriteId, marketId){
  fetch(BASE_FAVORITE_URL+`/${favoriteId}`,{
    method: 'DELETE'
    })
  .then(function(){
    let favDiv = document.getElementById(`favorite-div-${marketId}`)
    favDiv.innerHTML = ''
    favDiv.innerHTML = `<p class="favorite-tag">Favorite</p>`
  })
}

///function to fetch and create favorite from backend --------------------- FF
function createFavorite(marketId, userId){
  fetch(BASE_FAVORITE_URL,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      market_id: marketId,
      user_id: userId
    })
  })
  .then(function(response){
    return response.json()
  })
  .then(function(responseJson){
    console.log(responseJson)
    let favDiv = document.getElementById(`favorite-div-${marketId}`)
    favDiv.innerHTML = ''
    favDiv.innerHTML = `<p data-id="${responseJson.id}" class="unfavorite-tag">Unfavorite</p>`
  })
}


///////////////////////////////////////////////////////////////////////////
///////    ********* User  -- Functions ********************

/// function to fetch and add users reviews to their profile ------------  UF
function renderUserReviews() {
  let userReviews = document.getElementById("user-reviews")
  fetch(BASE_REVIEW_URL+`/user/${localStorage.userId}`)
  .then(function(response){
    return response.json()
  })
  .then(function(reviewsArr){
    if (reviewsArr.length === 0 ) {
      userReviews.innerHTML += "You Have No Reviews Yet"
    } else {
      for (review of reviewsArr) {
        userStore.reviews.push(review)
        userReviews.innerHTML += `<div id="market-review-${review.id}" class="market-reviews">
        <p>Created at ${review.created_at}</p>
        <p class='title'>Review Title: ${review.review_title}</p>
        <p class='review-content'> ${review.review_text}</p>
        <p data-id="${review.id}" class="delete-user-review">Delete Your Review</p>
        </div>`
      }
    }
  })
}

///function to fetch and add users favorites to their profile --------  UF
function renderUserFavorites() {
  let userFavorites = document.getElementById("user-favorites")
  fetch(BASE_FAVORITE_URL+`/user/${localStorage.userId}`)
  .then(function(response){
    return response.json()
  })
  .then(function(favoriteArr) {
    if (favoriteArr.length === 0) {
      userFavorites.innerHTML += "You Have No Favorites Yet"
    } else {
      for (favorite of favoriteArr) {
        userStore.favorites.push(favorite)
        userFavorites.innerHTML += ``
      }
    }
  })
}


///funtion to show user page -------------------------------------------  UF
function displayUser(user) {
  localStorage.setItem('userId', user.id)
  localStorage.setItem('userName', user.name)
  userDisplay.innerHTML= `Logged In As: ${user.name}`
  content.innerHTML = `<div id="user-div">
  <div id="user-info">
    <h3>${user.name}</h3>
    <h4>Memeber Since: ${user.created_at}</h4>
  </div>
  <div id="user-favorites">Favorites: </div>
  <div id="user-reviews">Reviews: </div>
  </div>`
  renderUserReviews()
  renderUserFavorites()
}


///function to fetch user from backend ----------------------------------  UF
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

/// function to log in or create users ----------------------------------  UF
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

///////////////////////////////////////////////////////////////////////////
///////    ********* Review -- Functions ********************

///function to delete instance of review  --------------------------------- RF
function deleteReview(reviewId) {
  fetch(BASE_REVIEW_URL +`/${reviewId}`, {
    method: 'DELETE'
  })
  .then(function(){
    console.log("that mutherfucker is goooone!")
  })
}

//function to fetch review from backend ---------------------------------- RF
function createReview(body){
  fetch(BASE_REVIEW_URL,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(function(response){
    return response.json()
  })
  .then(function(responseJson){
    // console.log(responseJson)
  })
}

///function to create review form ----------------------------------------- RF
function createReviewForm(marketId) {
  let reviewDiv = document.getElementById(`display-reviews-box-${marketId}`)
  reviewDiv.innerHTML += `<form id="add-review-form">
  <input type="text" name="Title" placeholder="Review Title" value="">
  <textarea name="Review Content" placeholder="Review Content Here" value=""></textarea>
  <input type="submit" name="Submit Review">
  </form>`
  reviewDiv.addEventListener("submit", (event) => {
    event.preventDefault()
    let body = {
      review_title: event.target[0].value,
      review_text: event.target[1].value,
      user_id: localStorage.userId,
      market_id: marketId
    }
    createReview(body)
    reviewDiv.innerHTML = `<p class="see-reviews-tag">See Reviews</p>`
  })
}


//function to fetch instance from backend for specific market -------------- RF
function displayMarketReviews(marketId) {
  fetch(BASE_REVIEW_URL+`/mkt/${marketId}`)
  .then(function(response){
    return response.json()
  })
  .then(function(responseJson){
    let reviewDiv =document.getElementById(`display-reviews-box-${marketId}`)
    reviewDiv.innerHTML = ''
    if(responseJson.length === 0){
      reviewDiv.innerHTML = '<p>This market has no reviews in it</p>'
    } else {
      for(review of responseJson){
        reviewDiv.innerHTML += `<div id="market-review-${review.id}" class="market-reviews">
        <p>Created at ${review.created_at}</p>
        <p class='title'>Review Title: ${review.review_title}</p>
        <p class='review-content'> ${review.review_text}</p>
        </div>
        `
        if (review.user_id === parseInt(localStorage.userId)) {
          reviewDiv.innerHTML += `<p data-id="${review.id}" class="delete-user-review">Delete Your Review</p>`
        }
      }
      reviewDiv.innerHTML += `<div><p class="hide-review-tag" data-id="${marketId}">Hide Reviews</p>
      </div>`
    }

  })
}


/////////////////////////////////////////////////////////////////
/// ************* The BIG Button Creator ********************

/////button creation ----------------------------------------------- tBBC
window.addEventListener("click", (event) => {
  if (event.target.className === "add-review-tag") {
    let marketId = event.target.parentElement.dataset.id
    createReviewForm(marketId)
  }
  if (event.target.className ==="favorite-tag") {
    let marketId = event.target.parentElement.parentElement.dataset.id
    let userId = localStorage.userId
    createFavorite(marketId, userId)
  }
  if (event.target.className ==="unfavorite-tag") {
    let favoriteId = event.target.dataset.id
    let marketId = event.target.parentElement.parentElement.dataset.id
    deleteFavorite(favoriteId,marketId)
  }
  if (event.target.id === "user-display") {
    createOrLogIn()
  }
  if (event.target.className === "see-reviews-tag"){
    let marketId = event.target.parentElement.parentElement.dataset.id
    displayMarketReviews(marketId)
  }
  if (event.target.className === "hide-review-tag"){
    let marketId = event.target.dataset.id
    let reviewDiv = document.getElementById(`display-reviews-box-${marketId}`)
    reviewDiv.innerHTML = `<p class="see-reviews-tag">See Reviews</p>`
  }
  if (event.target.className === "delete-user-review") {
    let reviewId = event.target.dataset.id
    let reviewBox = document.getElementById(`market-review-${reviewId}`)
    deleteReview(reviewId)
    reviewBox.innerHTML=""
  }
})

////search bar value ------------------------------------------- tBBC
formInput.addEventListener('submit', (event) => {
  event.preventDefault()
  let input = event.target.children[0].value
  let input_location = event.target.children[1].value
  formatYelpBody(input, input_location)
})


///////////////////////////////////////////////////////////////////
///// ********** Yelp ---- Functions ***********************

////structure body for yelp fetch ------------------------------ YP
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

///fetch from yelp via rails (backend)  ------------------------- YP
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


///function to output results to page  ------------------------- YP
function renderResultsToPage(results) {
  content.innerHTML = ""
  const busArr = results.businesses
  for(market of busArr) {
    content.innerHTML += `<div data-id="${market.id}" class="business-box">
    <div class="business-thumbnail"><img height="20%" width="20%" src="${market.image_url}"></div>
      <div class="business-info">
        <h4><a href="${market.url}">${market.name}</a></h4>
        <p>${market.location.display_address.join(" ")}</p>
        <p><a href="tel:${market.phone}">${market.display_phone}</a></p>
      </div>
      <p class="add-review-tag">Add Review</p>
    <div id="favorite-div-${market.id}"> <p class="favorite-tag">Favorite</p></div>
      <div id="display-reviews-box-${market.id}"><p class="see-reviews-tag">See Reviews</p></div>
    </div>`
  }
}

///fetch from local db
function init() {
  userDisplay.innerHTML = "Please Log In Or Create Account";
  content.innerHTML = '<img id="image-placeholder" src="images/noodles.jpeg">'
}
