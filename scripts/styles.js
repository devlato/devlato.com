(function() {
  'use strict';

  var NO_FILE = null;
  var NO_VERSION = undefined;

  function removeSubstring(string, pattern) {
    return (string || '').replace(pattern, '');
  }

  function normalizeFileName(name, extension) {
    return removeSubstring(removeSubstring(name, /^\//gi), new RegExp('\.' + extension + '$', 'gi'));
  }

  function normalizeFolderName(name) {
    return removeSubstring(name, /\/$/gi);
  }

  function generateFileURL(folder, extension, name, version) {
    var fileName = normalizeFileName(name, extension);
    var folderName = normalizeFolderName(folder);

    if (!fileName) {
      return NO_FILE;
    }

    if (version) {
      return folder + '/' + fileName + '.' + extension + '?v=' + version;
    }

    return folder + '/' + fileName + '.' + extension;
  }

  function generateStyleFileURL(name, version) {
    return generateFileURL('/styles', 'css', name, version);
  }

  function generateScriptFileURL(name, version) {
    return generateFileURL('/scripts', 'js', name, version);
  }

  function generateImageFileURL(name, version) {
    var parts = name.split('.');
    return generateFileURL('/images', parts[1], parts[0], version);
  }

  function createStyleElement(url) {
    var link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;

    return link;
  }

  function createImageElement(url) {
    var image = document.createElement('img');

    image.src = url;

    return image;
  }

  function injectCSS(name, version) {
    var url = generateStyleFileURL(name, version);
    var element;

    if (url === NO_FILE) {
      return NO_FILE;
    }

    element = createStyleElement(url);
    document.head.appendChild(element);
    return element;
  }

  function injectImage(name, version) {
    var url = generateImageFileURL(name, version);

    if (url === NO_FILE) {
      return NO_FILE;
    }

    return createImageElement(url);
  }

  function preload(version) {
    injectCSS('fonts', version);
    injectImage('octopus.svg', version).addEventListener('load', function() {
      injectCSS('images', version);
    });
  }

  function extractVersion(url) {
    var parts = (url || '').split('?');
    var query;
    var match;
    var param;

    if (parts.length < 2) {
      return NO_VERSION;
    }

    query = parts[parts.length - 1];
    match = query.match(/v=(.+?)(?:&|\?|$)/g);

    if (!match && !match[0]) {
      return NO_VERSION;
    }

    param = match[0].replace(/&/i, '').split('=');

    if (param.length < 2) {
      return NO_VERSION;
    }

    return param[param.length - 1];
  }

  function getScriptVersion() {
    var currentScript = document.querySelector('script[src*="' + generateScriptFileURL('styles') + '"]');
    return extractVersion(currentScript.src) || NO_VERSION;
  }

  function runImmediately() {
    preload(getScriptVersion());
  }

  function runWhenDOMReady() {
    document.addEventListener('DOMContentLoaded', function() {
      runImmediately();
    });
  }

  function isDOMReady() {
    return document.readyState !== 'loading';
  }

  function execAsync(fn) {
    var timer = setTimeout(function() {
      clearTimeout(timer);
      fn();
    }, 0);
  }

  function start() {
    if (isDOMReady()) {
      return execAsync(runImmediately);
    }

    return runWhenDOMReady();
  }

  start();
})();

