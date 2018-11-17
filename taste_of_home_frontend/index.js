
//////////**** Global Variables ************************************

document.addEventListener("DOMContentLoaded", init)
let BASE_USER_URL = 'http://localhost:3000/users'
let BASE_SEARCH_URL = 'http://localhost:3000/search'
let BASE_FAVORITE_URL = 'http://localhost:3000/favorites'
let BASE_REVIEW_URL = 'http://localhost:3000/reviews'
let BASE_MARKET_URL = 'http://localhost:3000/markets'
let formInput = document.getElementById('search-inputs')
let content = document.getElementById('content-box')
let userDisplay = document.getElementById("user-display")
let userStore = {favorites: [], reviews:[], markets: []}

///////////////////////////////////////////////////////////////////////////
///////    ********* Favorite -- Functions ********************

function displayFavoriteMarket(marketId){
  let displayMarket = document.getElementById('fav-market-display')
  for (market of userStore['markets']){
    console.log(market)
    if (market.yelp_id === marketId){
      let displayAddress = market["address"]
      displayMarket.innerHTML = `<div data-id="${market.yelp_id}" class="display-market-box">
       <div class="users-business-thumbnail">
         <img src="${market.image_url}">
      </div>
      <h4><a href="${market.web_url}">${market.name}</a></h4>
      <p>${displayAddress}</p>
      <p><a href="tel:${market.phone}">${market.display_phone}</a></p>
      </div>
      <div class="hide-display-market-box">Hide Market</div>`
    }
  }
}
// function to fetch and delete instance of favorite ---------------------- FF
function deleteFavorite(favoriteId, marketId){
  console.log(favoriteId, marketId)
  let url = BASE_FAVORITE_URL+`/${favoriteId}`
  fetch(url, {
    method: 'DELETE'
    })
  .then(function(){
    for (fav in userStore["favorites"]) {
      if (userStore["favorites"][fav].market_id === marketId) {
        userStore["favorites"].splice(fav, 1)
      }
    }
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
  .then(function(favorite){
    return favorite.json()
  })
  .then(function(favoriteJson){
    userStore["favorites"].push(favoriteJson)
    fetchAndPushMarket(favoriteJson.market_id)
    let favDiv = document.getElementById(`favorite-div-${marketId}`)
    favDiv.innerHTML = ''
    favDiv.innerHTML = `<p data-id="${favoriteJson.id}" class="unfavorite-tag">Unfavorite</p>`
  })
}

///////////////////////////////////////////////////////////////////////////
///////// *********** Market --- Functions *******************

//// functiont to fetch market instances from rails and push to user store -- MF
function fetchAndPushMarket(marketId) {
  // console.log(marketId)
  let url = BASE_MARKET_URL + `/${marketId}`
  fetch(url)
  .then(function(response){
    return response.json()
  })
  .then(function(marketObj){
    if (marketObj !== null) {
      userStore["markets"].push(marketObj)
    }
  })
}

///////////////////////////////////////////////////////////////////////////
///////    ********* User  -- Functions ********************

/// function to fetch and add users reviews to their profile ------------  UF
function renderUserReviews(display = false) {
  let userReviews = document.getElementById("user-reviews")
  fetch(BASE_REVIEW_URL+`/user/${localStorage.userId}`)
  .then(function(response){
    return response.json()
  })
  .then(function(reviewsArr){
    if (reviewsArr.length > 0) {
      for (review of reviewsArr) {
        fetchAndPushMarket(review.market_id)
        userStore["reviews"].push(review)
        if (display === true) {
          let market
          for(marketObj of userStore["markets"]){
            if (review.market_id === marketObj.yelp_id){
              market = marketObj
            }
          }
          userReviews.innerHTML += `<div id="market-review-${review.id}" class="market-reviews">
          <p> Market Name: ${market.name} </p>
          <p class='title'>${review.review_title}</p>
          <p class='review-content'> ${review.review_text}</p>
          <p data-id="${review.id}" class="delete-user-review">Delete Your Review</p>
          </div>`
        }
      }
    } else if (reviewsArr.length === 0 && display === true) {
      userReviews.innerHTML += "You Have No Reviews Yet"
    }
  })
}

///function to fetch and add users favorites to their profile --------  UF
function renderUserFavorites(display = false) {
  let userFavorites = document.getElementById("user-favorites")
  fetch(BASE_FAVORITE_URL+`/user/${localStorage.userId}`)
  .then(function(response){
    return response.json()
  })
  .then(function(favoriteArr) {
    if (favoriteArr.length > 0) {
      for (favorite of favoriteArr) {
        fetchAndPushMarket(favorite.market_id)
        userStore["favorites"].push(favorite)
        if (display === true) {
          let market
          for(marketObj of userStore["markets"]){
            if(marketObj["yelp_id"] === favorite.market_id){
              market = marketObj
            }
          }
          userFavorites.innerHTML +=`
            <h4 data-id="${market.yelp_id}" class="favorite-box">
            ${market.name}</h4>
            `
        }
      }
    } else if (favoriteArr.length === 0 && display === true) {
      userFavorites.innerHTML += "You Have No Favorites Yet"
    }
  })
}


////funtion to show user logged in on header bar ----------------------  UF
function userLoggedInDisplay() {
  userDisplay.innerHTML= `<div><p id='user-logged-in'>Logged In As: ${localStorage.userName} </p><p id="logout-tag">Logout</p></div>`
  content.innerHTML = '<img id="image-placeholder" src="images/noodles.jpeg">'
}

///funtion to show user page -------------------------------------------  UF
function displayUser() {
  let display = true
  userLoggedInDisplay()
  content.innerHTML = `<div id="user-div">
  <div id="user-info">
    <h3>${localStorage.userName}</h3>
    <h4>Member Since: ${localStorage.userSince}</h4>
  </div>
    <div id="user-favorites"><p class="user-text">Favorites: </p></div>
    <div id="user-reviews"><p class="user-text">Reviews: </p></div>
    <div id="fav-market-display"></div>
  </div>`
  renderUserReviews(display)
  renderUserFavorites(display)
}


///function to fetch user from backend ----------------------------------  UF
function fetchUser(userName, passWord, doThing) {
  let body = {
    name: userName,
    password: passWord
  }
  fetch(BASE_USER_URL, {
    method: doThing,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
  .then(function(response) {
    return response.json()
  })
  .then(function(userObject) {
    console.log(userObject)
    if(userObject.error === true){
      alert('You need an account to log in!!')
      userSignUp()
    } else{
      localStorage.setItem('userId', userObject.id)
      localStorage.setItem('userName', userObject.name)
      localStorage.setItem('userSince', userObject.created_at)
    displayUser()
   }
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
    <div id="sign-up">Sign Up</div>
  </div>`
  let userForm = document.getElementById("add-or-create-user")
  userForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let userName = event.target[0].value
    let password = event.target[1].value
    let doThing = 'PATCH'
    fetchUser(userName, password, doThing)
  })
}

/// function to user sign up
function userSignUp(){
  content.innerHTML = `<div id="add-user-form-div">
    <form id="add-or-create-user">
      <input type="text" name="user-name" placeholder="Name" value=""><br>
      <input type="password" name="password" placeholder="Password" value=""><br>
      <input type="password" name="password" placeholder="Password" value=""><br>
      <input type="submit" value="sign up">
    </form>
  </div>`
  let userForm = document.getElementById("add-or-create-user")
  userForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let userName = event.target[0].value
    let password1 = event.target[1].value
    let password2 = event.target[2].value
    let doThing = 'POST'
    if(password1 === password2){
      fetchUser(userName, password1, doThing)
    }
    else {
      alert("Your password doesn't match")
    }
  })

}

///funtion to log user out --------------------------------------------  UF
function userLogOut() {
  localStorage.clear()
  userStore["reviews"] = []
  userStore["favorites"] = []
  userStore["markets"] = []
  userDisplay.innerHTML = "Please Log In Or Create Account";
  content.innerHTML = '<img id="image-placeholder" src="images/noodles.jpeg">'
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
    let reviewBox = document.getElementById(`market-review-${reviewId}`)
    reviewBox.innerHTML=""
  })
}

//function to fetch review from backend ---------------------------------- RF
function createReview(body){
  console.log(body)
  fetch(BASE_REVIEW_URL,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(function(review){
    return review.json()
  })
  .then(function(reviewJson){
    fetchAndPushMarket(reviewJson.market_id)
    userStore["reviews"].push(reviewJson)
  })
}

///function to create review form ----------------------------------------- RF
function createReviewForm(marketId) {
  let reviewDiv = document.getElementById(`the-display-reviews-box-${marketId}`)
  reviewDiv.innerHTML = ""
  reviewDiv.innerHTML += `<div class="review-form-style"><form id="add-review-form-${marketId}">
  <p>Review Title</p><input type="text" name="Title" value=""><br>
  <p>Your Review</p><textarea name="Review Content" value=""></textarea><br>
  <input type="submit" name="Submit Review">
  </form></div>`
  let addReviewForm = document.getElementById(`add-review-form-${marketId}`)
  addReviewForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let body = {
      user_name: localStorage.userName,
      review_title: event.target.children[1].value,
      review_text: event.target.children[4].value,
      user_id: localStorage.userId,
      market_id: marketId
    }
    createReview(body)
    reviewDiv.innerHTML = ""
  })
}


//function to fetch instance from backend for specific market -------------- RF
function displayMarketReviews(marketId) {
  fetch(BASE_REVIEW_URL+`/mkt/${marketId}`)
  .then(function(response){
    return response.json()
  })
  .then(function(responseJson){
    let reviewBox = document.getElementById(`the-display-reviews-box-${marketId}`)
    if(responseJson.length === 0){
      reviewBox.innerHTML = '<p>This market has no reviews in it</p>'
    } else {
      reviewBox.innerHTML = ""
      for(review of responseJson){
        reviewBox.innerHTML += `<div id="market-review-${review.id}" class="market-reviews">
        <p class='title'>Review Title: ${review.review_title}</p>
        <p> by ${review.user_name}</p>
        <p class='review-content'> ${review.review_text}</p>
        <div id='delete-div-${review.id}'></div>
        </div>
        `
        if (review.user_id === parseInt(localStorage.userId)) {
          let deleteDiv = document.getElementById(`delete-div-${review.id}`)
          deleteDiv.innerHTML = `<p data-id="${review.id}" class="delete-user-review">Delete Your Review</p>`
        }
      }
      let reviewButton = document.getElementById(`display-reviews-button-${marketId}`)
      reviewButton.innerHTML = `<p class="hide-review-tag" data-id="${marketId}">Hide Reviews</p>`
    }
  })
}


/////////////////////////////////////////////////////////////////
/// ************* The BIG Button Creator ********************

/////button creation ----------------------------------------------- tBBC
window.addEventListener("click", (event) => {
  if (event.target.className === "add-review-tag") {
    let marketId = event.target.dataset.id
    if (localStorage.length === 0) {
      alert("You need to be logged in to add a review")
    } else {
      createReviewForm(marketId)
    }
  }
  if (event.target.className ==="favorite-tag") {
    let marketId = event.target.parentElement.parentElement.parentElement.dataset.id
    let userId = localStorage.userId
    if (localStorage.length === 0) {
      alert("You need to be logged in to favorite a market")
    } else {
      createFavorite(marketId, userId)
    }
  }
  if (event.target.className ==="unfavorite-tag") {
    let favoriteId = event.target.dataset.id
    let marketId = event.target.parentElement.parentElement.parentElement.dataset.id
    deleteFavorite(favoriteId,marketId)
  }
  if (event.target.id === "user-display") {
    createOrLogIn()
  }
  if (event.target.className === "see-reviews-tag"){
    let marketId = event.target.dataset.id
    displayMarketReviews(marketId)
  }
  if (event.target.className === "hide-review-tag"){
    let marketId = event.target.dataset.id
    let reviewButton = document.getElementById(`display-reviews-button-${marketId}`)
    let reviewBox = document.getElementById(`the-display-reviews-box-${marketId}`)
    reviewButton.innerHTML = `<p data-id="${marketId}" class="see-reviews-tag">See Reviews</p>`
    reviewBox.innerHTML = ""
  }
  if (event.target.className === "delete-user-review") {
    let reviewId = event.target.dataset.id
    let reviewBox = document.getElementById(`market-review-${review.id}`)
    deleteReview(reviewId)
    reviewBox.innerHTML=""
  }
  if (event.target.id === "logout-tag") {
    userLogOut()
  }
  if(event.target.id === "user-logged-in"){
    displayUser()
  }
  if(event.target.id === "sign-up"){
    userSignUp()
  }
  if (event.target.id === "title-div") {
    console.log(true)
    content.innerHTML = '<img id="image-placeholder" src="images/noodles.jpeg">'
  }
  if (event.target.className === "favorite-box"){
    let marketId = event.target.dataset.id
    displayFavoriteMarket(marketId)
  }
  if (event.target.className === "hide-display-market-box"){
    console.log(true)
    let marketBox = document.getElementById('fav-market-display')
    marketBox.innerHTML = ""
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
      categories: "market,supermarket,grocery"
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
  content.innerHTML = ""
  content.innerHTML = '<div class="loader"></div>'
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
      <div class="business-thumbnail">
        <img src="${market.image_url}">
      </div>
      <div class="business-info">
        <h4><a href="${market.url}">${market.name}</a></h4>
        <p>${market.location.display_address.join(" ")}</p>
        <p><a href="tel:${market.phone}">${market.display_phone}</a></p>
      </div>
      <div class="user-action">
        <p data-id="${market.id}" class="add-review-tag">Add Review</p>
        <div id="favorite-div-${market.id}" class="fav-div-box"><p class="favorite-tag">Favorite</p></div>
        <div id="display-reviews-button-${market.id}" data-id="${market.id}"><p data-id="${market.id}" class="see-reviews-tag">See Reviews</p></div>
      </div>
      <div id="the-display-reviews-box-${market.id}" class="review-box"></div>
    </div>`
    for (favs of userStore["favorites"]) {
      let favDiv = document.getElementById(`favorite-div-${market.id}`)
      if (favs["market_id"] === market.id) {
        favDiv.innerHTML = `<p data-id="${favs["id"]}" class="unfavorite-tag">Unfavorite</p>`
      }
    }
  }
}

///fetch from local db
function init() {
  if (localStorage.length === 0) {
    userDisplay.innerHTML = "Please Log In Or Create Account";
    content.innerHTML = '<img id="image-placeholder" src="images/noodles.jpeg">'
  } else {
    userLoggedInDisplay()
    renderUserReviews()
    renderUserFavorites()
  }
}
