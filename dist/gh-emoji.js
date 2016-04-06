(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.ghEmoji = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.find = find;
  exports.load = load;
  exports.all = all;
  exports.exist = exist;
  exports.getUrl = getUrl;
  exports.parse = parse;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var enpoint = 'https://api.github.com/emojis';
  var delimiterRegex = /(\:[\w\-\+]+\:)/g;
  var emojis = null;

  function find(text) {
    return text.match(delimiterRegex) || [];
  }

  function load() {
    return new Promise(function (resolve) {
      if (emojis) return resolve(emojis);

      return fetch(enpoint).then(function (r) {
        return r.json();
      }).then(function (response) {
        emojis = response;
        resolve(emojis);
      });
    });
  }

  function all() {
    return emojis;
  }

  function exist(emojiId) {
    return !!all()[emojiId];
  }

  function getUrl(emojiId) {
    return all()[emojiId];
  }

  function parse(text) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var output = '';
    var customClassNames = options.classNames ? options.classNames.trim().split(/\s+/) : '';

    output += text.replace(delimiterRegex, function (match) {
      var name = match.replace(/:/g, '');
      var classNames = ['gh-emoji', 'gh-emoji-' + name];

      if (!exist(name)) {
        return match;
      }

      if (customClassNames) {
        classNames.push.apply(classNames, _toConsumableArray(customClassNames));
      }

      var imageSrc = getUrl(name);
      var imageClass = classNames.join(' ');
      var imageAlt = name;

      return '<img src="' + imageSrc + '" class="' + imageClass + '" alt="' + imageAlt + '" />';
    });

    return output;
  }
});
