import './style.css'
import BoartdDisplay from './BoardDisplay.ts'
import Board from './Board.ts'
import { generateBoard, setupBoard } from './utils.ts'

const root = document.getElementById('app')

let serial = localStorage.getItem('lastSerial') || ''
let solvedSerial = localStorage.getItem('solvedSerial') || ''

if (root) {
  const display = new BoartdDisplay(root)
  const board = new Board({ display, shouldShowInfo: true })

  const regenerateBoard = () => {
    localStorage.setItem('lastSerial', '')
    localStorage.setItem('solvedSerial', '')
    board.cells.forEach(cell => cell.value = null)
    board.draw()
    board.showInfo()
    generateBoard(board, () => {
      localStorage.setItem('solvedSerial', board.seralized)
      setupBoard(board, 40, () => {
        board.hideInfo()
        localStorage.setItem('lastSerial', board.seralized)
      })
    })
  }

  const toggleSolve = () => {
    let nextSerial = serial
    const unsolved = board.seralized === serial
    if (unsolved) {
      nextSerial = solvedSerial
      solveButton.innerHTML = 'Unsolve'
    } else {
      nextSerial = serial
      solveButton.innerHTML = 'Solve'
    }
    board.setFromSerial(nextSerial)
    board.draw()
  }

  if (serial) {
    board.hideInfo()
    board.setFromSerial(serial)
    board.draw()
  } else {
    board.draw()

    regenerateBoard()
  }

  const toggleInfo = () => {
    if (board.shouldShowInfo) {
      board.hideInfo()
      infoButton.innerHTML = 'Show Info'
    } else {
      board.showInfo()
      infoButton.innerHTML = 'Hide Info'
    }
  }

  const regenButton = document.createElement('button')
  regenButton.innerHTML = 'Regenerate'
  regenButton.addEventListener('click', () => regenerateBoard())

  const solveButton = document.createElement('button')
  solveButton.innerHTML = 'Solve'
  solveButton.addEventListener('click', () => toggleSolve())

  const infoButton = document.createElement('button')
  infoButton.innerHTML = board.shouldShowInfo ? 'Hide Info' : 'Show Info'
  infoButton.addEventListener('click', () => toggleInfo())

  const container = document.createElement('div')
  container.setAttribute('id', 'buttons')

  const buttons = [
    regenButton,
    solveButton,
    infoButton,
  ]

  buttons.forEach(button => container.appendChild(button))

  root.parentNode?.appendChild(container)
}
