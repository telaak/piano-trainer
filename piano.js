const dimWidth = 1920
const dimHeight = window.innerHeight
const bottomOffset = 240

const whiteKey = {
  xPos: 0,
  yPos: dimHeight - bottomOffset,
  width: 35,
  height: 150
}

const blackKey = {
  xPos: 0,
  yPos: dimHeight - bottomOffset,
  width: whiteKey.width / 2,
  height: 90
}

let pianoCanvas = document.getElementById('piano-canvas')
let noteCanvas = document.getElementById('note-canvas')
pianoCanvas.width = dimWidth - 16
pianoCanvas.height = dimHeight - 16
noteCanvas.width = dimWidth - 16
noteCanvas.height = dimHeight - 16
let ctx = pianoCanvas.getContext('2d')
let noteCtx = noteCanvas.getContext('2d')

const whiteKeys = [
  'A0',
  'B0',
  'C1',
  'D1',
  'E1',
  'F1',
  'G1',
  'A1',
  'B1',
  'C2',
  'D2',
  'E2',
  'F2',
  'G2',
  'A2',
  'B2',
  'C3',
  'D3',
  'E3',
  'F3',
  'G3',
  'A3',
  'B3',
  'C4',
  'D4',
  'E4',
  'F4',
  'G4',
  'A4',
  'B4',
  'C5',
  'D5',
  'E5',
  'F5',
  'G5',
  'A5',
  'B5',
  'C6',
  'D6',
  'E6',
  'F6',
  'G6',
  'A6',
  'B6',
  'C7',
  'D7',
  'E7',
  'F7',
  'G7',
  'A7',
  'B7',
  'C8'
]

const blackKeys = [
  'A#0',
  'C#1',
  'D#1',
  'F#1',
  'G#1',
  'A#1',
  'C#2',
  'D#2',
  'F#2',
  'G#2',
  'A#2',
  'C#3',
  'D#3',
  'F#3',
  'G#3',
  'A#3',
  'C#4',
  'D#4',
  'F#4',
  'G#4',
  'A#4',
  'C#5',
  'D#5',
  'F#5',
  'G#5',
  'A#5',
  'C#6',
  'D#6',
  'F#6',
  'G#6',
  'A#6',
  'C#7',
  'D#7',
  'F#7',
  'G#7',
  'A#7'
]

const whiteKeyMap = []

const blackKeyMap = []

const drawWhiteKeys = keyCount => {
  for (let i = 1; i <= keyCount; i++) {
    whiteKeyMap.push({
      id: whiteKeys[i - 1],
      xPos: whiteKey.xPos + i * whiteKey.width,
      yPos: whiteKey.yPos,
      width: whiteKey.width,
      height: whiteKey.height,
      index: i - 1,
      type: 'white'
    })
    drawBorder(
      whiteKey.xPos + i * whiteKey.width,
      whiteKey.yPos,
      whiteKey.width,
      whiteKey.height
    )
    ctx.fillStyle = '#FFF'
    ctx.fillRect(
      whiteKey.xPos + i * whiteKey.width,
      whiteKey.yPos,
      whiteKey.width,
      whiteKey.height
    )
  }
}

const blackKeyArray = [
  1,
  3,
  4,
  6,
  7,
  8,
  10,
  11,
  13,
  14,
  15,
  17,
  18,
  20,
  21,
  22,
  24,
  25,
  27,
  28,
  29,
  31,
  32,
  34,
  35,
  36,
  38,
  39,
  41,
  42,
  43,
  45,
  46,
  48,
  49,
  50
]

drawWhiteKeys(52)

blackKeyArray.forEach((key, index) => {
  ctx.fillStyle = '#000'
  blackKeyMap.push({
    id: blackKeys[index],
    xPos: 1.5 * blackKey.width + blackKey.xPos + blackKey.width * (key * 2),
    yPos: blackKey.yPos,
    width: blackKey.width,
    height: blackKey.height,
    index: key,
    type: 'black'
  })
  ctx.fillRect(
    1.5 * blackKey.width + blackKey.xPos + blackKey.width * (key * 2),
    blackKey.yPos,
    blackKey.width,
    blackKey.height
  )
})

function drawBorder (xPos, yPos, width, height, canvas = ctx, thickness = 1) {
  canvas.fillStyle = '#000'
  canvas.fillRect(
    xPos - thickness,
    yPos - thickness,
    width + thickness * 2,
    height + thickness * 2
  )
}
const audioContext = new AudioContext()
let pianoInstrument

Soundfont.instrument(audioContext, 'acoustic_grand_piano', {
  soundfont: 'MusyngKite'
}).then(function (piano) {
  pianoInstrument = piano
})

document.addEventListener('keydown', e => {
  if (e.key === 'a') {
    pianoInstrument.play('A0')
  }
})

document.addEventListener('keypress', e => {
  if (e.key === 'b') {
    pianoInstrument.stop()
  }
})

pianoCanvas.addEventListener(
  'mousedown',
  event => {
    const blackKey = blackKeyMap.find(key => {
      return (
        key.xPos < event.pageX &&
        key.xPos + key.width > event.pageX &&
        key.yPos < event.pageY &&
        key.yPos + key.height > event.pageY
      )
    })
    if (blackKey) {
      pianoInstrument.play(blackKey.id)
    } else {
      pianoInstrument.play(
        whiteKeyMap.find(key => {
          return (
            key.xPos < event.pageX &&
            key.xPos + key.width > event.pageX &&
            key.yPos < event.pageY &&
            key.yPos + key.height > event.pageY
          )
        }).id
      )
    }
  },
  false
)

let fallingNotes = []

const fallingNoteTimer = setInterval(() => {
  noteCtx.clearRect(0, 0, dimWidth, dimHeight)
  fallingNotes.forEach(fallingNote => {
    switch (fallingNote.type) {
      case 'white':
        drawBorder(
          (fallingNote.index + 1) * whiteKey.width,
          fallingNote.yPos,
          whiteKey.width,
          whiteKey.height,
          noteCtx
        )
        noteCtx.fillStyle = '#FFF'
        noteCtx.fillRect(
          (fallingNote.index + 1) * whiteKey.width,
          fallingNote.yPos,
          whiteKey.width,
          whiteKey.height
        )
        fallingNote.yPos += 2
        break
      case 'black':
        noteCtx.fillStyle = '#000'
        noteCtx.fillRect(
          1.5 * blackKey.width + blackKey.xPos + blackKey.width * (fallingNote.index * 2),
          fallingNote.yPos,
          blackKey.width,
          blackKey.height
        )
        fallingNote.yPos += 2
        break
    }
  })
}, 16.67)

const addFallingNote = noteName => {
  let note =
    blackKeyMap.find(key => key.id === noteName) ||
    whiteKeyMap.find(key => key.id === noteName)
  fallingNotes.push({
    index: note.index,
    yPos: 0,
    type: note.type
  })
}

setInterval(() => {
  const randomNote =
    Math.random() < 0.5
      ? whiteKeys[Math.floor(Math.random() * whiteKeys.length)]
      : blackKeys[Math.floor(Math.random() * blackKeys.length)]
  addFallingNote(randomNote)
  console.log(randomNote)
}, 1500)
