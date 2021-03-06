'use strict';

/* Utilities */

angular.module('fcmderUtils', [])
.service('fcmderUtils.service', function() {
  var self = this;
  this.app = {
    kind2mount: function(kind, mime) {
      switch(kind) {
        case 'File':
          kind = 'files/' + mime;
          break;
        case 'Folder':
          kind = 'folders';
          break;
        case 'Alias':
          kind = 'aliases';
          break;
        default:
          kind = (typeof kind === 'string')
                    ? ((kind.charAt(kind.length - 1) === 's')
                        ? kind.toLowerCase() + 'es'
                        : kind.toLowerCase() + 's')
                    : '';
      }
      return '/' + kind;
    },
    path2url: function(path) {
      // TODO read mount via other way - move 'rest-api/' definition outside of js
      var url = self.path.join(location.pathname, 'rest-api/');
      if (typeof path === 'string') {
        url = self.path.join(url, path);
      }
      url = self.path.removeTrailingSlash(url);
      return (!url || typeof url !== 'string') ? null : url;
    },
    meta2kind: function(meta) {
      if (!meta) {
        return null;
      }
      if (!!meta.isFile && !meta.isDir && !meta.isLink) {
        return 'File';
      }
      if (!meta.isFile && !!meta.isDir && !meta.isLink) {
        return 'Folder';
      }
      if (!meta.isFile && !meta.isDir && !!meta.isLink) {
        return 'Alias';
      }
      return 'unknown'
    }
  };
  // TODO add browserified versions for path utils
  this.path = {
    removeTrailingSlash: function(p) {
      if (typeof p !== 'string') {
        return null;
      }
      return (p === '/') ? p : p.replace(/\/+$/, '');
    },
    normalize: function(p) {
      if (typeof p !== 'string') {
        return null;
      }
      var arr = p.split('/');
      var out = [];
      var first = '';
      if (arr[0] === '') {
        arr.shift();
        first = '/';
      }
      var last = '';
      if (arr.length && arr[arr.length - 1] === '') {
        arr.pop();
        last = '/';
      }
      for(var i = 0, len = arr.length; i < len; i++) {
        if (!arr[i] || arr[i] === '.') {
          continue;
        }
        if (arr[i] === '..') {
          if (out.length) {
            out.pop();
            continue;
          }
        }
        out.push(arr[i]);
      }
      return first + out.join('/') + last;
    },
    basename: function(p) {
      p = self.path.removeTrailingSlash(p + '');
      var name;
      if ((name = p.match(/[^\/]*$/)) === null) {
        return p;
      }
      return name[0];
    },
    join: function(first, second) {
      if (typeof first !== 'string' || typeof second !== 'string') {
        return null;
      }
      var firstSlash = (first.charAt(first.length - 1) === '/');
      var secondSlash = (second.charAt(0) === '/');
      if ((firstSlash && !secondSlash) || (!firstSlash && secondSlash)) {
        return first + second;
      }
      if (firstSlash && secondSlash) {
        return first + second.slice(1);
      }
      return first + '/' + second;
    }
  };
  this.common = {
    // TODO add browserified versions
    inherits: function(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
});
