/* eslint-env worker */
let game = null
const gameSet = []

self.onconnect = function (e) {
  var port = e.ports[0]

  if (!game) {
    game = new Game()
    game.initialize(port)
  } else {
    game.ready(port)
    gameSet.push(game)
    game = null
  }
}

class Game {
  initialize (port) {
    this.player1 = port
  }

  ready (port) {
    this.player2 = port

    const boardStateO = emptyBoard()
    const boardStateX = emptyBoard()

    this.player1.postMessage({type: 'ready', moveFirst: true})
    this.player2.postMessage({type: 'ready', moveFirst: false})

    function setup (playerA, playerB, boardState) {
      playerA.onmessage = e => {
        if (e.data.type !== 'move') return
        const {row, column} = e.data
        boardState[row][column] = true
        if (winner(boardState)) {
          playerA.postMessage({type: 'gameover'})
          Object.assign(e.data, {gameover: true})
        }
        playerB.postMessage(e.data)
      }
    }

    setup(this.player1, this.player2, boardStateX)
    setup(this.player2, this.player1, boardStateO)
  }
}

function winner (arr) {
  for (var i = 0; i < 3; i++) {
    if (arr[i][0] && arr[i][1] && arr[i][2]) return true
    if (arr[0][i] && arr[1][i] && arr[2][i]) return true
  }
  if (arr[0][0] && arr[1][1] && arr[2][2]) return true
  if (arr[0][2] && arr[1][1] && arr[2][0]) return true
  return false
}

function emptyBoard () {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]
}
