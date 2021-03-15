let db = firebase.firestore()

firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // Signed in
    console.log('signed in')

    // // display username for current user
    // document.querySelector('.sign-in-or-sign-out').innerHTML = `
    // <button class="text-grey-500 underline sign-out">Sign Out</button>
    // `

    // Sign-out button
    document.querySelector('.sign-out').innerHTML = `
      <button class="top-0 right-0 text-white bg-blue-800 bg-opacity-50 rounded px-2 py-1 sign-out">Sign Out</button>
    `
    document.querySelector('.sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })


    // Listen for the form submit and create/render the new post
    document.querySelector('form').addEventListener('submit', async function(event) {
      event.preventDefault()
      let postUsername = user.displayName
      let postImageUrl = document.querySelector('#image-url').value
      let postDish = document.querySelector('#dish').value
      let postRestaurant = document.querySelector('#restaurant').value
      let postPrice = document.querySelector('#price').value
      let postRating = document.querySelector('#rating').value

      let response = await fetch('/.netlify/functions/create_dish', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.uid,
          username: postUsername,
          imageUrl: postImageUrl,
          dish: postDish,
          restaurant: postRestaurant,
          price: postPrice,
          rating: postRating,
          likes: 0
        })
      })
      let dish = await response.json()
      document.querySelector('#image-url').value = "" // clear image URL field
      document.querySelector('#dish').value = ""
      document.querySelector('#restaurant').value = ""
      document.querySelector('#price').value = ""
      document.querySelector('#rating').value = ""
      renderPost(dish)
    }) 

    //create blank array query that will have all restaurants 
    let restaurantQuery = []

    let response = await fetch('/.netlify/functions/get_dishes')
    let dishes = await response.json()
    for (let i=0; i<dishes.length; i++) {
      let dish = dishes[i]
      renderPost(dish)
      
      //creates query of all restaurants to create filter buttons
      let restaurant = dish.restaurant
      if (restaurantQuery.indexOf(restaurant) < 0){
        restaurantQuery.push(restaurant)
      }    
    }

    //restaurant buttons
    let restaurant = ''
    let numRestaurants = restaurantQuery.length
    restaurantQuery.sort()
    for (let i=0; i<numRestaurants; i++) {
      renderRestaurant(restaurantQuery[i])
    }
    let restaurants = document.querySelectorAll('.restaurant')

    // console.log(numRestaurants)

    for (let i=0; i<numRestaurants; i++) {
      restaurants[i].addEventListener('click', async function(event) {
        event.preventDefault()
        restaurant = restaurants[i].innerHTML
        console.log(`${restaurant} clicked`)

        //clear all previous rendered posts

        const item = document.querySelector('.dishes')
        while (item.firstChild) {
          item.removeChild(item.firstChild)
        }

        //render posts for only dishes that are part of restaurant clicked
        let response = await fetch('/.netlify/functions/get_dishes')
        let dishes = await response.json()
        for (let i=0; i<dishes.length; i++) {
          let dish = dishes[i]
          if(dish.restaurant == restaurant){
            renderPost(dish)  
          }     
        }
      })
    }
  
  } else {
    // Signed out
    console.log('signed out')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'index.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in', authUIConfig)
  }
})

async function renderRestaurant(restaurant) {
  document.querySelector('.restaurants').insertAdjacentHTML('beforeend', `
  <button class="restaurant text-white px-4 py-2 rounded-xl">${restaurant}</button>
  `)
}
//<button class="restaurant inline bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl">${restaurant}</button>

async function renderPost(dish) {
  let dishId = dish.id
  document.querySelector('.dishes').insertAdjacentHTML('beforeend', `
    <div class="dish-${dishId} md:mt-16 mt-8 space-y-4 rounded-lg p-4 border-solid border-8 border-gray-400">
      <div class="flex md:mx-4 mx-2">
        <span class="w-1/4 text-left font-light text-lg">${dish.restaurant}</span>
        <span class="w-1/2 text-center font-bold text-lg underline">${dish.dish}</span>
        <span class="w-1/4 text-right text-lg font-light">@${dish.username}</span>
      </div>
      <div>
        <img src="${dish.imageUrl}" class="w-full shadow-xl">
      </div>

      <div class="flex text-2xl md:mx-4 mx-2">
        <button class="like-button">🔥</button> 
        <span class = "w-1/4 likes">${dish.likes}</span>
        <span class="w-1/3 text-center rating">${dish.rating}/10</span>
        <span class="w-1/3 text-right price"> $${dish.price}</span>
      </div>
      </div>
  `)

  let likeButton = document.querySelector(`.dish-${dishId} .like-button`)
  likeButton.addEventListener('click', async function(event) {  
    event.preventDefault()
    console.log(`dish ${dishId} like button clicked!`)
    let currentUserId = firebase.auth().currentUser.uid

    let response = await fetch('/.netlify/functions/like', {
      method: 'POST',
      body: JSON.stringify({
        dishId: dishId,
        userId: currentUserId
      })
    })
    if (response.ok) {
      let existingNumberOfLikes = document.querySelector(`.dish-${dishId} .likes`).innerHTML
      let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
      document.querySelector(`.dish-${dishId} .likes`).innerHTML = newNumberOfLikes
    }
  }) 
}
