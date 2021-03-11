// /.netlify/functions/create_dish
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  // let userId = body.userId
  // let username = body.username
  // let imageUrl = body.imageUrl


  let userId = body.userId
  let username = body.username
  let imageUrl = body.imageUrl
  let dish = body.dish
  let restaurant = body.restaurant
  let price = parseFloat(body.price)
  let rating = parseFloat(body.rating)

  console.log(`user: ${userId}`)
  console.log(`imageUrl: ${imageUrl}`)
  console.log(`dish: ${dish}`)
  console.log(`restaurant: ${restaurant}`)
  console.log(`price: ${price}`)
  console.log(`rating: ${rating}`)

  let newDish = {
    userId: userId,
    username: username, 
    imageUrl: imageUrl,
    dish: dish,
    restaurant: restaurant,
    price: price,
    rating: rating, 
    created: firebase.firestore.FieldValue.serverTimestamp()
  }

  let docRef = await db.collection('dishes').add(newDish)

  newDish.id = docRef.id
  newDish.likes = 0

  return {
    statusCode: 200,
    body: JSON.stringify(newDish)
  }

}