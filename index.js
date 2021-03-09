let db = firebase.firestore()

firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // Signed in
    console.log('signed in')

    // Sign-out button
    document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <button class="text-pink-500 underline sign-out">Sign Out</button>
    `
    document.querySelector('.sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'index.html'
    })
  
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

      //will need to convert into netlify function that is commented out below
      // let addPost = await db.collection('dishes').add({
      //   username: postUsername,
      //   imageUrl: postImageUrl,
        // dish: postDish,
        // restaurant: postRestaurant,
        // price: postPrice,
        // rating: postRating,
        // likes: 0
      // })
      
      //now converted to netlify 
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
      // console.log(dish)
    }) 
      //will need to replace with json netfliy functions later 
        // let querySnapshot = await db.collection('dishes').get()
        // let dishes = querySnapshot.docs

      // for(let i = 0; i<dishes.length; i++) {
      //   let dishId = dishes[i].id 
      //   let dishData = dishes[i].data()
      //   let dishUsername = dishData.username
      //   let dishImageUrl = dishData.imageUrl
      //   let dishDish = dishData.dish
      //   let dishRestaurant = dishData.restaurant
      //   let dishPrice = dishData.price
      //   let dishRating = dishData.rating
      //   let dishLikes = dishData.likes
      //   console.log(dishDish)
   
    let response = await fetch('/.netlify/functions/get_dishes')
    let dishes = await response.json()
    for (let i=0; i<dishes.length; i++) {
      let dish = dishes[i]
      renderPost(dish)
    
      
        // document.querySelector('.dishes').insertAdjacentHTML('beforeend', `
        //   <div class="dish-${dishId} md:mt-16 mt-8 space-y-8">
        //     <div class="md:mx-0 mx-4">
        //       <span class="font-bold text-xl">${dishDish}</span>
        //     </div>
        //     <div>
        //       <img src="${dishImageUrl}" class="w-full">
        //     </div>
      
        //     <div class="text-3xl md:mx-0 mx-4">
        //       <button class="like-button">❤️</button>
        //       <span class="likes">${dishLikes}</span>
        //       <span class="rating">${dishRating}/10 </span>
        //       <span class="price"> $${dishPrice}</span>
        //       <span class="username text-sm text-right font-light">@${dishUsername}</span>
        //     </div>
        //   </div>
        // `)

        // //add likes when the button is clicked 
        // document.querySelector(`.dish-${dishId} .like-button`).addEventListener('click', async function(event){  
        //   event.preventDefault()
        //   console.log(`dish ${dishId} like button clicked!`)
        //   let existingNumberOfLikes = document.querySelector(`.dish-${dishId} .likes`).innerHTML
        //   let newNumberOfLikes= parseInt(existingNumberOfLikes) + 1
        //   document.querySelector(`.dish-${dishId} .likes`).innerHTML = newNumberOfLikes
        //   await db.collection('dishes').doc(dishId).update({
        //     likes: firebase.firestore.FieldValue.increment(1)
        //   })
        // })        
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
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})

async function renderPost(dish) {
  let dishId = dish.id
  document.querySelector('.dishes').insertAdjacentHTML('beforeend', `
    <div class="dish-${dishId} md:mt-16 mt-8 space-y-8">
      <div class="md:mx-0 mx-4">
        <span class="font-bold text-xl">${dish.dish}</span>
      </div>
      <div>
        <img src="${dish.imageUrl}" class="w-full">
      </div>

      <div class="text-3xl md:mx-0 mx-4">
        <button class="like-button">❤️</button>
        <span class="likes">${dish.likes}</span>
        <span class="rating">${dish.rating}/10 </span>
        <span class="price"> $${dish.price}</span>
        <span class="username text-sm text-right font-light">@${dish.username}</span>
      </div>
    </div>
  `)

  //add likes when the button is clicked 
  // document.querySelector(`.dish-${dishId} .like-button`).addEventListener('click', async function(event){
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

    // let existingNumberOfLikes = document.querySelector(`.dish-${dishId} .likes`).innerHTML
    // let newNumberOfLikes= parseInt(existingNumberOfLikes) + 1
    // document.querySelector(`.dish-${dishId} .likes`).innerHTML = newNumberOfLikes
    // await db.collection('dishes').doc(dishId).update({
    //   likes: firebase.firestore.FieldValue.increment(1)
    // })
  }) 
}
