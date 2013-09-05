### baidu-push

node.js sdk for baidu push service
```bash
npm install baidu-push
```

### 百度云推送

### 使用
* [参考代码](test/test.js)

* 文档

```js
var Push = require('baidu-push');

var userId = 'a userId';

var pushOption = {
  apiKey: 'your api key',
  secretKey: 'your secret key'
}

var client = new Push(pushOption);
```
```js
//根据 userId 向某一 user 推送消息
var option = {
  push_type: 1,
  user_id: userId,
  messages: JSON.stringify(["hello"]),
  msg_keys: JSON.stringify(["title"])
}

client.pushMessage(option, function(error, result) {
  if (error) console.log(error);
})
```
```js
//根据 tag 向一群 users 推送消息
var option = {
  push_type: 2,
  tag: testTag.name,
  messages: JSON.stringify(["push by tag"]),
  msg_keys: JSON.stringify(["title"])
}
client.pushMessage(option, function(error, result) {
  if (error) return console.log(error);
})
```
```js
//添加user的tag
var option = {
  tag: testTag.name,
  user_id: userId
}
client.setTag(option, function(error, result) {
  if (error) return console.log(error);
})
```
```js
//获取user的tag
var option = {
  user_id: userId
}
client.fetchTag(option, function(error, result) {
  if (error) return console.log(error);
})
```
```js
//删除user的tag
var option = {
  tag: testTag.name,
  user_id: userId
}
client.deleteTag(option, function(error, result) {
  if (error) return console.log(error);
})
```
```js
var option = {
  user_id: userId
}
client.queryBindList(option, function(error, result) {
  if (error) return console.log(error);
})
```
