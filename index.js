(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var body = document.querySelector('body');
var title = document.querySelector('h1');

var server = new window.SharedWorker('worker.js');

server.port.postMessage({ type: 'join' });

var mySymbol = 'O',
    yourSymbol = 'X';


server.port.onmessage = function (e) {
  if (e.data.type === 'ready') {
    if (e.data.moveFirst) {
      mySymbol = 'X';
      yourSymbol = 'O';

      title.textContent = 'Your turn now';
      body.addEventListener('click', listener);
    } else {
      title.textContent = 'Wait for your turn';
    }
  } else if (e.data.type === 'move') {
    var _e$data = e.data,
        row = _e$data.row,
        column = _e$data.column;

    var tile = document.querySelector('.tile.r' + row + '.c' + column);
    tile.textContent = yourSymbol;
    if (e.data.gameover) {
      title.textContent = 'You lose';
      body.addEventListener('click', function () {
        return window.location.reload();
      });
    } else {
      title.textContent = 'Your turn now';
      body.addEventListener('click', listener);
    }
  } else if (e.data.type === 'gameover') {
    title.textContent = 'You win';
    body.addEventListener('click', function () {
      return window.location.reload();
    });
  } else if (e.data.type === 'log') {
    console.log(e.data.message);
  }
};

function listener(event) {
  var tile = event.target;
  if (!tile.classList.contains('tile')) return;
  if (tile.textContent) return;
  var r = parseInt(tile.classList[1][1], 10);
  var c = parseInt(tile.classList[2][1], 10);

  tile.textContent = mySymbol;
  server.port.postMessage({ type: 'move', row: r, column: c });
  title.textContent = 'Wait for your turn';
  body.removeEventListener('click', listener);
}

},{}]},{},[1]);
