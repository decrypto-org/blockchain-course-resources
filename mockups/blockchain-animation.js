let canvas = document.getElementsByTagName('canvas')[0]
let ctx = canvas.getContext('2d')
ctx.lineWidth = 5

let W = 600, H = 600

let rounds = []

let SPEED = 0.5
let TOTAL_PARTIES = 100, ADV_PARTIES = 20
let FORK_PROB = 0.2
let ROUND_DURATION = 400
let BLOCK_WIDTH = 50
let BLOCK_DISTANCE = 50
let sideScroll = -W / 2

class Block {
  constructor() {
    this.adversarial = Math.random() * TOTAL_PARTIES < ADV_PARTIES
    this.genesis = false
  }
}

class Round {
  constructor() {
    this.middle = new Block()
    if (Math.random() < FORK_PROB) {
      this.upper = new Block()
    }
    if (Math.random() < FORK_PROB) {
      this.lower = new Block()
    }
  }
}

genesis = { middle: { adversarial: false, genesis: true } }
rounds.push(genesis)

let t = 0
let absoluteT = (new Date()) | 0

function modelToView({x, y}) {
  return {
    x: x * (BLOCK_WIDTH + BLOCK_DISTANCE) - sideScroll,
    y: y * (BLOCK_WIDTH + BLOCK_DISTANCE) + 400
  }
}

function renderBlock(block, x, y, linePos, whatToDraw) {
  if (typeof block === 'undefined') {
    return
  }
  let {x: blockX, y: blockY} = modelToView({x, y})

  if (whatToDraw.block) {
    if (block.adversarial) {
      ctx.fillStyle = 'red'
    }
    else {
      ctx.fillStyle = 'white'
    }
    ctx.fillRect(blockX, blockY, BLOCK_WIDTH, BLOCK_WIDTH)
    ctx.strokeStyle = 'gray'
    ctx.strokeRect(blockX, blockY, BLOCK_WIDTH, BLOCK_WIDTH)
  }
  if (whatToDraw.line) {
    if (block.genesis) {
      return
    }
    let {x: prevBlockX, y: prevBlockY} = modelToView({x: x - 1, y: linePos})

    ctx.beginPath()
    if (linePos == 0 && y == -1) {
      ctx.moveTo(prevBlockX + BLOCK_WIDTH / 2, prevBlockY)
    }
    else if (linePos == 0 && y == 1) {
      ctx.moveTo(prevBlockX + BLOCK_WIDTH / 2, prevBlockY + BLOCK_WIDTH)
    }
    else {
      ctx.moveTo(prevBlockX + BLOCK_WIDTH, prevBlockY + BLOCK_WIDTH / 2)
    }
    ctx.lineTo(blockX, blockY + BLOCK_WIDTH / 2)
    ctx.strokeStyle = 'white'
    ctx.stroke()
  }
}

function render() {
  let hadUpper, hadLower, x

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, W, H)

  for (let whatToDraw of [{line: true}, {block: true}]) {
    x = 0
    hadUpper = false
    hadLower = false
    for (let round of rounds) {
      renderBlock(round.middle, x, 0, 0, whatToDraw)

      if (round.upper) {
        renderBlock(round.upper, x, -1, hadUpper? -1: 0, whatToDraw)
      }
      if (round.lower) {
        renderBlock(round.lower, x, 1, hadLower? 1: 0, whatToDraw)
      }

      hadUpper = typeof round.upper !== 'undefined'
      hadLower = typeof round.lower !== 'undefined'

      ++x
    }
  }
}
function integrate() {
  let dt = ((new Date()) | 0) - absoluteT
  dt *= SPEED
  absoluteT = (new Date()) | 0
  t += dt

  let currentRound = Math.floor(t / ROUND_DURATION)
  if (rounds.length < currentRound) {
    rounds.push(new Round())
  }

  sideScroll = -W + (t / ROUND_DURATION) * (BLOCK_WIDTH + BLOCK_DISTANCE)

  render()
  requestAnimationFrame(integrate)
}
render()
integrate()
