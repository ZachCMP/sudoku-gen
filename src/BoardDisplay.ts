import Board from "./Board"
import Cell from "./Cell"

export default class BoardDisplay {
  root: HTMLElement
  focusedCell?: Cell
  cellMap: Map<Cell, HTMLTableCellElement>

  constructor(root: HTMLElement) {
    this.root = root
    this.cellMap = new Map<Cell, HTMLTableCellElement>()

    this.root.addEventListener('keydown', e => {
      const value = parseInt(e.key)
      const cell = this.focusedCell
      if (!cell) return
      if (!isNaN(value)) {
        cell.value = value - 1
        cell.setValue(value - 1)
      } else if (e.key === 'Backspace') {
        cell.setValue(null)
      } else if (e.key === 'ArrowDown') {
        if (cell) {
          const nextCell = Array.from(this.cellMap.keys()).find(c => c.xPos === cell.xPos && c.yPos === cell.yPos + 1)
          if (nextCell) this.cellMap.get(nextCell)?.focus()
        }
      } else if (e.key === 'ArrowUp') {
        if (cell) {
          const nextCell = Array.from(this.cellMap.keys()).find(c => c.xPos === cell.xPos && c.yPos === cell.yPos - 1)
          if (nextCell) this.cellMap.get(nextCell)?.focus()
        }
      } else if (e.key === 'ArrowLeft') {
        if (cell) {
          const nextCell = Array.from(this.cellMap.keys()).find(c => c.xPos === cell.xPos - 1 && c.yPos === cell.yPos)
          if (nextCell) this.cellMap.get(nextCell)?.focus()
        }
      } else if (e.key === 'ArrowRight') {
        if (cell) {
          const nextCell = Array.from(this.cellMap.keys()).find(c => c.xPos === cell.xPos + 1 && c.yPos === cell.yPos)
          if (nextCell) this.cellMap.get(nextCell)?.focus()
        }
      }
    })
  }

  draw(board: Board) {
    this.root.replaceChildren(this.drawTable(board))
  }

  drawTable(board: Board): HTMLTableElement {
    const table = document.createElement('table')
    table.setAttribute('id', 'sudoku-table')
    if (!board.valid) table.classList.add('invalid')
    const tbody = document.createElement('tbody')
    table.appendChild(tbody)

    this.cellMap = new Map<Cell, HTMLTableCellElement>()

    board.rows.forEach(row => {
      const tr = document.createElement('tr')
      row.forEach(cell => {
        tr.appendChild(this.drawCell(cell))
      })
      tbody.appendChild(tr)
    })

    return table
  }

  drawCell(cell: Cell): HTMLTableCellElement {
    const td = document.createElement('td')
    td.setAttribute('tabindex', '0')

    const tdNumber = document.createElement('div')
    tdNumber.innerHTML = `${cell.value !== null ? cell.value + 1 : ''}`
    td.appendChild(tdNumber)

    if (cell.board.shouldShowInfo) {
      const tdPossibleNumbers = document.createElement('div')
      tdPossibleNumbers.setAttribute('class', 'possible')
      tdPossibleNumbers.innerHTML = cell.allowedValues.map(v => v + 1).join(' ')
      td.appendChild(tdPossibleNumbers)
    }

    td.addEventListener('focus', () => {
      this.focusedCell = cell
    })

    if (this.focusedCell === cell) {
      setTimeout(() => td.focus(), 10)
    }

    this.cellMap.set(cell, td)

    return td
  }
}
