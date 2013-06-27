var util = require('util');
var assert = require('assert');
var crypto = require('crypto');
var http = require('http');
var querystring = require('querystring');
var PROTOCOL_SCHEMA = 'http://';
var SERVER_HOST = 'channel.api.duapp.com';
var COMMON_PATH = '/rest/2.0/channel/';

function urlencode (string) {
  // http://kevin.vanzonneveld.net
  string = (string + '').toString();
  // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(string).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}
function getTimestamp() {
  var timestamp = Math.floor(new Date().getTime() / 1000);
  return timestamp;
}
function sortObject(originObject) {
  var index = [];
  var tempObject = {};
  for (var i in originObject) {
    if (originObject.hasOwnProperty(i)) {
      index.push(i);
    }
  }

  index.sort();

  for(i = 0; i < index.length; i++) {
    tempObject[index[i]] = originObject[index[i]];
  }
  return tempObject;
}
function generateSign(method, url, params, secretKey) {
  var baseString = method + url;

  for (var i in params) {
    baseString += (i + '=' + params[i]);
  }

  baseString += secretKey;
  //var encodeString = encodeURIComponent(baseString);
  var encodeString = urlencode(baseString);

  var md5sum = crypto.createHash('md5');
  md5sum.update(encodeString);

  var sign = md5sum.digest('hex');
  return sign;
}
function request(bodyArgs, path, sk, id, host, callback) {
  assert.ok(bodyArgs.method);
  assert.ok(path);
  assert.ok(sk);

  bodyArgs.sign = generateSign('POST', PROTOCOL_SCHEMA + host + path, bodyArgs, sk);

  var bodyArgsArray = [];
  for (var i in bodyArgs) {
    if (bodyArgs.hasOwnProperty(i)) {
      bodyArgsArray.push(i + '=' + urlencode(bodyArgs[i]));
      }
  }
  var bodyStr = bodyArgsArray.join('&');

  var options = {
    host: host,
    method: 'POST',
    path: path,
    headers: {
      'Content-Length': bodyStr.length,
      'Content-Type':'application/x-www-form-urlencoded'
    }
  };

  var req = http.request(options, function (res) {
    var resBody = '';
    res.on('data', function (chunk) {
      resBody += chunk;
    });

    res.on('end', function () {
      try {
        var jsonObj = JSON.parse(resBody);
      } catch(e) {
        callback && callback(e);
        return;
      }
      var errObj = null;
      id.request_id = jsonObj['request_id'];
      if (res.statusCode != 200) {
        errObj = new Error(jsonObj);
      }
      callback(errObj, jsonObj);
    });
  });

  req.on('error', function (e) {
    console.log('error : ' + util.inspect(e));
    callback(e, null);
  });
  req.write(bodyStr);
  req.end();
}
function Push(options) {
  var self = this;
  var option = {
    ak: process.env.BAE_ENV_AK,
    sk: process.env.BAE_ENV_SK,
    host: process.env.BAE_ENV_ADDR_CHANNEL || SERVER_HOST
  }

  if (options) {
    for (var i in options) {
      if (options.hasOwnProperty(i)) {
        if (typeof options[i] === 'string') {
          option[i] = options[i];
        } else {
          throw new Error('Invalid ak, sk, or counter host')
        }
      }
    }
  }

  self.ak = option.ak;
  self.sk = option.sk;
  self.host = option.host;
  self.request_id = null;
}
Push.prototype.queryBindList = function (options, callback) {
  var self = this;
  var option = {};
  if (typeof options === 'function' && arguments.length === 1) {
    callback = options;
    options = {}
  }

  if (!options) {
    options = {}
  }

  for (var i in options) {
    if (options.hasOwnProperty(i)) {
      option[i] = options[i];
    }
  }

  var path = COMMON_PATH + (options['channel_id'] || 'channel');
  option['method'] = 'query_bindlist';
  option['apikey'] = self.ak;
  option['timestamp'] = getTimestamp();
  option = sortObject(option);

  var wrap_id = {request_id: null};
  request(option, path, self.sk, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      callback && callback(err);
      return;
    }
    callback && callback(null, result);
  });
}
Push.prototype.pushMsg = function (options, callback) {
  var self = this;
  var option = {};
  if (typeof options === 'function' && arguments.length === 1) {
    callback = options;
    options = {}
  }

  if (!options) options = {};

  for (var i in options) {
    if (options.hasOwnProperty(i)) option[i] = options[i];
  }

  var path = COMMON_PATH + 'channel';

  option['method'] = 'push_msg';
  option['apikey'] = self.ak;
  option['timestamp'] = getTimestamp();
  option = sortObject(option);

  var wrap_id = {request_id: null};
  request(option, path, self.sk, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      callback && callback(err);
      return;
    }
    callback && callback(null, result);
  });
}
Push.prototype.setTag = function (options, callback) {
  var self = this;
  var option = {};
  if (typeof options === 'function' && arguments.length === 1) {
    callback = options;
    options = {};
  }

  if (!options) {
    options = {};
  }

  for (var i in options) {
    if (options.hasOwnProperty(i)) {
      option[i] = options[i];
    }
  }

  var path = COMMON_PATH + 'channel';

  option['method'] = 'set_tag';
  option['apikey'] = self.ak;
  option['timestamp'] = getTimestamp();
  option = sortObject(option);

  var wrap_id = {request_id: null};
  request(option, path, self.sk, wrap_id, self.host, function (err, result) {
    self.request_id = wrap_id.request_id;
    if (err) {
      callback && callback(err);
      return;
    }
    callback && callback(null, result);
  });
}

module.exports = Push;
