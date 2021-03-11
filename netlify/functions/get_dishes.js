// /.netlify/functions/get_dishes
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()                                     // define a variable so we can use Firestore
  let dishesData = []                                               // an empty Array
  
  let dishesQuery = await db.collection('dishes')                   // posts from Firestore
                            .orderBy('rating', "desc")              // ordered by dish rating
                            .get()
  let dishes = dishesQuery.docs                                     // the post documents themselves
  
  // loop through the post documents
  for (let i=0; i<dishes.length; i++) {
    let dishId = dishes[i].id                                       // the ID for the given post
    let dishData = dishes[i].data()                                 // the rest of the post data
    let likesQuery = await db.collection('likes')                   // likes from Firestore
                             .where('dishId', '==', dishId)         // for the given postId
                             .get()
    // let commentsQuery = await db.collection('comments')     // likes from Firestore
    //                          .where('postId', '==', postId) // for the given postId
    //                          .get()
    // let commentsData = []                                   // an empty Array
    // let comments = commentsQuery.docs                       // the comments documents

    // // loop through the comment documents
    // for (let i=0; i<comments.length; i++) {
    //   let comment = comments[i].data()                      // grab the comment data
    //   commentsData.push({
    //     username: comment.username,                         // the author of the comment
    //     text: comment.text                                  // the comment text
    //   })
    // }

    // add a new Object of our own creation to the postsData Array
    
    dishesData.push({
      id: dishId,                                           // the post ID
      imageUrl: dishData.imageUrl,                          // the image URL
      username: dishData.username,                          // the username
      imageUrl: dishData.imageUrl,
      dish: dishData.dish,
      restaurant: dishData.restaurant,
      price: dishData.price,
      rating: dishData.rating,
      likes: likesQuery.size,                               // number of likes
    //   comments: commentsData                                // an Array of comments
    })
  }
  
  // return an Object in the format that a Netlify lambda function expects
  return {
    statusCode: 200,
    body: JSON.stringify(dishesData)
  }
}