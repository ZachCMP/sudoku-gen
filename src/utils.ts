import Board from "./Board";
import Cell from "./Cell";

const ITERATION_SPEED = 25

export const generateBoard = (board: Board, onDone: VoidFunction) => {
  const setTryMax = () => {
    let result = 0
    const group = board.groups.find(group => group.some(cell => cell.value === null))
    if (!group) return 0
    group.filter(cell => cell.value === null).forEach(cell => result += cell.allowedValues.length)
    return result
  }

  let tryMax = setTryMax()
  let tries: string[] = []

  const retry = () => setTimeout(() => generateCell(), 1)

  const generateCell = () => {
    const group = board.groups.find(group => group.some(cell => cell.value === null))
    if (!group) return
    const candidates = group.filter(cell => cell.value === null)
    const index = Math.floor(Math.random() * candidates.length)

    const cell = candidates[index]

    if (!cell) {
      retry()
      return
    } else if (cell.value !== null) {
      retry()
      return
    } else {
      const valueIndex = Math.floor(Math.random() * cell.allowedValues.length)
      const value = cell.allowedValues[valueIndex]
      if (isNaN(value)) return

      const tryValue = [cell.xPos, cell.yPos, value].join(':')
      if (tries.includes(tryValue)) {
        retry()
        return
      }
      tries.push(tryValue)

      cell.value = value

      if (!board.valid) {
        cell.value = null
        if (tries.length >= tryMax) {
          board.cells.forEach(cell => cell.value = null)
          board.draw()
          generateBoard(board, onDone)
          return
        }
        retry()
        return
      } else {
        tries = []
        tryMax = setTryMax()
        cell.setValue(value)
      }
    }

    if (board.cells.some(cell => cell.value === null)) {
      setTimeout(() => generateCell(), ITERATION_SPEED)
    } else {
      onDone()
    }
  }

  generateCell()
}

export const setupBoard = (board: Board, desiredAbiguityLevel: number = 1, onDone: VoidFunction) => {
  const setTryMax = () => {
    return board.cells.filter((cell) => cell.value !== null).length
  }

  let tryMax = setTryMax()
  let tries: Cell[] = []

  const retry = () => setTimeout(() => removeValue(), 1)

  const removeValue = () => {
    if (board.ambiguityLevel >= desiredAbiguityLevel) return onDone()

    const filledCells = board.cells.filter(cell => cell.value !== null)
    const pickedIndex = Math.floor(Math.random() * filledCells.length)
    const cell = filledCells[pickedIndex]

    if (!cell) {
      return retry()
    }

    if (tries.length > tryMax) {
      return
    }

    if (tries.includes(cell)) return retry()

    tries.push(cell)

    const prevValue = cell.value

    cell.value = null

    if (board.ambiguous) {
      cell.value = prevValue
    } else {
      board.draw()
      tryMax = setTryMax()
      tries = []
      setTimeout(removeValue, ITERATION_SPEED)
    }
  }

  removeValue()
}
