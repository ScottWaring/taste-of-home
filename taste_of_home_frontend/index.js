document.addEventListener("DOMContentLoaded", init)
let BASE_USER_URL = 'http://localhost:3000/users'
let BASE_SEARCH_URL = 'http://localhost:3000/search'
let formInput = document.querySelector('form')




////search bar value
formInput.addEventListener('submit', (event) => {
  event.preventDefault()
  let input = event.target.children[0].value
  let input_location = event.target.children[1].value
  console.log(input_location)
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
  console.log(results)
  // const businesses = results.businesses
  // for(place of businesses) {
  //   console.log(place)
  // }
}

///fetch from local db
function init() {
  fetch(BASE_USER_URL)
  .then(function(response) {
    return response.json()
  })
  .then(function(responseJson) {
    console.log(responseJson)
  })
}
