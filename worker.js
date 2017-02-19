(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-env worker */
var game = null;
var gameSet = [];

self.onconnect = function (e) {
  var port = e.ports[0];

  if (!game) {
    game = new Game();
    game.initialize(port);
  } else {
    game.ready(port);
    gameSet.push(game);
    game = null;
  }
};

var Game = function () {
  function Game() {
    _classCallCheck(this, Game);
  }

  _createClass(Game, [{
    key: 'initialize',
    value: function initialize(port) {
      this.player1 = port;
    }
  }, {
    key: 'ready',
    value: function ready(port) {
      this.player2 = port;

      var boardStateO = emptyBoard();
      var boardStateX = emptyBoard();

      this.player1.postMessage({ type: 'ready', moveFirst: true });
      this.player2.postMessage({ type: 'ready', moveFirst: false });

      function setup(playerA, playerB, boardState) {
        playerA.onmessage = function (e) {
          if (e.data.type !== 'move') return;
          var _e$data = e.data,
              row = _e$data.row,
              column = _e$data.column;

          boardState[row][column] = true;
          if (winner(boardState)) {
            playerA.postMessage({ type: 'gameover' });
            Object.assign(e.data, { gameover: true });
          }
          playerB.postMessage(e.data);
        };
      }

      setup(this.player1, this.player2, boardStateX);
      setup(this.player2, this.player1, boardStateO);
    }
  }]);

  return Game;
}();

function winner(arr) {
  for (var i = 0; i < 3; i++) {
    if (arr[i][0] && arr[i][1] && arr[i][2]) return true;
    if (arr[0][i] && arr[1][i] && arr[2][i]) return true;
  }
  if (arr[0][0] && arr[1][1] && arr[2][2]) return true;
  if (arr[0][2] && arr[1][1] && arr[2][0]) return true;
  return false;
}

function emptyBoard() {
  return [[null, null, null], [null, null, null], [null, null, null]];
}

},{}]},{},[1]);
