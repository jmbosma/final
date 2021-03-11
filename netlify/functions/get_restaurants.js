// /.netlify/functions/get_dishes
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()                                     // define a variable so we can use Firestore
  let dishesData = []                                               // an empty Array
  
  let dishesQuery = await db.collection('dishes')                   // posts from Firestore
                            .get()
  let dishes = dishesQuery.docs                                     // the post documents themselves
  
  // loop through the post documents
  for (let i=0; i<dishes.length; i++) {
    let dishData = dishes[i].data()                                 // the rest of the post data

    dishesData.push({
      restaurant: dishData.restaurant,
    })
  }
  
  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(dishesData)
  }
}