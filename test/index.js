
var userId = '644038823502246388';
var Push = require('../index');

var opt = {
  ak: '',
  sk: ''
}

var client = new Push(opt);

var option = {
  push_type: 1,
  user_id: userId,
  messages: JSON.stringify(["中国人发了@124589"]),
  msg_keys: JSON.stringify(["title"])
}

client.pushMsg(option, function(error, result) {
  if (error) {
    console.log(error);
    return;
  }
  console.log(result);
})

// var setTagOption = {
//   tag: '绝对是百度云的问题',
//   user_id: userId
// }
// client.setTag(setTagOption, function(error, result) {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   console.log(result);
// })

// var fetchTagOption = {
//   user_id: userId
// }
// client.fetchTag(fetchTagOption, function(error, result) {
//   if (error) {
//     return console.log(error);
//   }
//   for (var i in result) {
//     console.log(result[i])
//   }
// })

// var deleteTagOption = {
//   tag: '137',
//   user_id: userId
// }
// client.deleteTag(deleteTagOption, function(error, result) {
//   if (error) {
//     return console.log(error);
//   }
//   console.log(result);
// })

// var option = {
//   push_type: 2,
//   tag: '就是你哈哈哈',
//   messages: JSON.stringify(["就是你哈哈哈@124589"]),
//   msg_keys: JSON.stringify(["title"])
// }
// client.pushMsg(option, function(error, result) {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   console.log(result);
// })

// var option = {
//   user_id: userId
// }
// client.queryBindList(option, function(err, result) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(result);
// })
