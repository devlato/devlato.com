(function() {
  'use strict';

  var USER_ID = 'UA-116908400-1';

  function execAsync(fn) {
    var timer = setTimeout(function() {
      clearTimeout(timer);
      fn();
    }, 0);
  }

  function fakeGA() {
    if (!console || typeof console.log !== 'function') {
      return;
    }

    console.log('Cannot track the event:', arguments);
  }

  function getGA() {
    if (typeof window.ga === 'function') {
      return window.ga;
    }

    return fakeGA;
  }

  function initGA() {
    window.dataLayer = window.dataLayer || [];

    if (!window.gtag) {
      window.gtag = function() {
        dataLayer.push(arguments);
      }
    }

    gtag('js', new Date());
    gtag('config', USER_ID);

    getGA()('create', USER_ID, 'auto');
    getGA()('set', 'transport', 'beacon');
  }

  function sendEvent(target, action, label, callback) {
    execAsync(function() {
      getGA()('send', 'event', 'com.devlato.' + target, action, label, {
        transport: 'beacon'
      });
    });
  }

  function startTracking(version) {
    document.querySelector('.icon-email').addEventListener('click', function() {
      sendEvent('links.email', 'click', 'Click on Email Link');
    });

    document.querySelector('.icon-github').addEventListener('click', function(e) {
      sendEvent('links.github', 'click', 'Click on GitHub Link');
    });

    document.querySelector('.icon-linkedin').addEventListener('click', function() {
      sendEvent('links.linkedin', 'click', 'Click on LinkedIn Link');
    });

    document.querySelector('.icon-twitter').addEventListener('click', function() {
      sendEvent('links.twitter', 'click', 'Click on Twitter Link');
    });

    document.querySelector('.icon-attachment').addEventListener('click', function() {
      sendEvent('links.resume', 'click', 'Click on Download Resume Link');
    });

    document.querySelector('.info__photo').addEventListener('click', function() {
      sendEvent('photo', 'click', 'Click on Octopus Logo');
    });

    document.querySelector('.info__header').addEventListener('click', function() {
      sendEvent('header', 'click', 'Click on Header Text');
    });

    document.body.addEventListener('selectstart', function(e) {
      if (e) {
        if (typeof e.stopPropagation === 'function') {
          e.stopPropagation();
        }

        if (typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
      }
      
      return false;
    }, true);
  }

  function runImmediately() {
    initGA();
    startTracking();
  }

  function runWhenDOMReady() {
    document.addEventListener('DOMContentLoaded', function() {
      runImmediately();
    });
  }

  function isDOMReady() {
    return document.readyState !== 'loading';
  }

  function start() {
    if (isDOMReady()) {
      return execAsync(runImmediately);
    }

    return runWhenDOMReady();
  }

  start();
})();

