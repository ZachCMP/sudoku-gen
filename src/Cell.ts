import Board, { ITERATOR } from "./Board";

export interface CellOptions {
  xPos: number;
  yPos: number;
  board: Board;
  value?: number | null
}

export default class Cell {
  xPos: number;
  yPos: number;
  board: Board;
  value: number | null;

  constructor({ xPos, yPos, board, value }: CellOptions) {
    this.xPos = xPos
    this.yPos = yPos
    this.board = board
    this.value = typeof value === 'number' ? value : null
  }

  setValue(val: number | null) {
    this.value = val
    this.board.draw()
  }

  get row() {
    return this.board.rows[this.yPos]
  }

  get column() {
    return this.board.columns[this.xPos]
  }

  get group() {
    return this.board.groups.find(group => group.includes(this))!
  }

  get allowedValues() {
    const rowVals = new Set(this.row.filter(cell => cell !== this).map(cell => cell.value))
    const columnVals = new Set(this.column.filter(cell => cell !== this).map(cell => cell.value))
    const groupVals = new Set(this.group.filter(cell => cell !== this).map(cell => cell.value))
    const allValues = rowVals.union(columnVals).union(groupVals)

    return Array.from(new Set(ITERATOR).difference(allValues))
  }
}
