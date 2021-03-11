// /.netlify/functions/like
let firebase = require('./firebase')

exports.handler = async function(event) {
  let db = firebase.firestore()
  let body = JSON.parse(event.body)
  let dishId = body.dishId
  let userId = body.userId
  
  // console.log(`dish: ${dishId}`)
  // console.log(`user: ${userId}`)

  let querySnapshot = await db.collection('likes')
                              .where('dishId', '==', dishId)
                              .where('userId', '==', userId)
                              .get()
  let numberOfLikes = querySnapshot.size

  if (numberOfLikes == 0) {
    await db.collection('likes').add({
      dishId: dishId,
      userId: userId
    })
    return { statusCode: 200 }
  } else {
    return { statusCode: 403 }
  }

}