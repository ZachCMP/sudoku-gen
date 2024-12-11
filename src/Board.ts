import BoartdDisplay from "./BoardDisplay";
import Cell from "./Cell";

export interface BoardOptions {
  display: BoartdDisplay
  shouldShowInfo?: boolean
}

export const ITERATOR = Array.from(Array(9).keys())
const GROUP_SELECTOR = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
]

export default class Board {
  display: BoartdDisplay
  cells: Cell[]
  shouldShowInfo: boolean

  constructor({ display, shouldShowInfo = false }: BoardOptions) {
    this.display = display
    this.shouldShowInfo = shouldShowInfo
    this.cells = this.buildCells()
  }

  draw() {
    this.display.draw(this)
  }

  showInfo() {
    this.shouldShowInfo = true
    this.draw()
  }

  hideInfo() {
    this.shouldShowInfo = false
    this.draw()
  }

  get rows() {
    return ITERATOR.map(yPos => this.cells.filter(cell => cell.yPos === yPos))
  }

  get columns() {
    return ITERATOR.map(xPos => this.cells.filter(cell => cell.xPos === xPos))
  }

  get groups() {
    let result: Cell[][] = []
    GROUP_SELECTOR.forEach(xPosList => {
      GROUP_SELECTOR.forEach(yPosList => {
        result.push(this.cells.filter(cell => xPosList.includes(cell.xPos) && yPosList.includes(cell.yPos)))
      })
    })

    return result
  }

  get valid() {
    return [
      this.rows,
      this.columns,
      this.groups,
    ].every(cellSets => (
      cellSets.every(cells => {
        if (cells.some(cell => cell.allowedValues.length < 1)) return false
        const values = cells.reduce((acc, cell) => cell.value !== null ? acc.add(cell.value) : acc, new Set([] as number[]))
        const allowedValues = cells.reduce((acc, cell) => cell.value === null ? acc.union(new Set(cell.allowedValues)) : acc, new Set([] as number[]))

        return values.union(allowedValues).size === 9 && values.intersection(allowedValues).size === 0
      })
    ))
  }

  get ambiguous() {
    return this.cells.every(cell => cell.allowedValues.length > 1)
  }

  get ambiguityLevel() {
    return this.cells.filter(cell => cell.value === null).reduce((acc, cell) => acc + cell.allowedValues.length, 0)
  }

  get seralized() {
    return this.cells.map(({ xPos, yPos, value }) => [xPos, yPos, value].join(':')).join('|')
  }

  hashMapFromSerial(serial: string) {
    return serial.split('|').reduce((acc, str) => {
      const [xPos, yPos, value] = str.split(':')
      const parsedValue = parseInt(value)
      return { ...acc, [[xPos, yPos].join(':')]: isNaN(parsedValue) ? null : parsedValue }
    }, {} as Record<string, number | null>)
  }

  setFromSerial(serial: string) {
    this.cells = this.buildCells(this.hashMapFromSerial(serial))
  }

  private buildCells(hashMap?: Record<string, number | null>) {
    let cells: Cell[] = []

    ITERATOR.forEach(xPos => {
      ITERATOR.forEach(yPos => {
        const hashSelector = [xPos, yPos].join(':')
        const hashValue = hashMap?.[hashSelector]
        const value = typeof hashValue === 'number' ? hashValue : null
        cells.push(new Cell({ xPos, yPos, value, board: this }))
      })
    })

    return cells
  }
}
