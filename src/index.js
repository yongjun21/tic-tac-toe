var body = document.querySelector('body')
var title = document.querySelector('h1')

var server = new window.SharedWorker('worker.js')

server.port.postMessage({type: 'join'})

let [mySymbol, yourSymbol] = ['O', 'X']

server.port.onmessage = function (e) {
  if (e.data.type === 'ready') {
    if (e.data.moveFirst) {
      [mySymbol, yourSymbol] = ['X', 'O']
      title.textContent = 'Your turn now'
      body.addEventListener('click', listener)
    } else {
      title.textContent = 'Wait for your turn'
    }
  } else if (e.data.type === 'move') {
    const {row, column} = e.data
    const tile = document.querySelector('.tile.r' + row + '.c' + column)
    tile.textContent = yourSymbol
    if (e.data.gameover) {
      title.textContent = 'You lose'
      body.addEventListener('click', () => window.location.reload())
    } else {
      title.textContent = 'Your turn now'
      body.addEventListener('click', listener)
    }
  } else if (e.data.type === 'gameover') {
    title.textContent = 'You win'
    body.addEventListener('click', () => window.location.reload())
  } else if (e.data.type === 'log') {
    console.log(e.data.message)
  }
}

function listener (event) {
  var tile = event.target
  if (!tile.classList.contains('tile')) return
  if (tile.textContent) return
  var r = parseInt(tile.classList[1][1], 10)
  var c = parseInt(tile.classList[2][1], 10)

  tile.textContent = mySymbol
  server.port.postMessage({type: 'move', row: r, column: c})
  title.textContent = 'Wait for your turn'
  body.removeEventListener('click', listener)
}
