class FloodFillCanvas {
  private buffer: Array<{x:number, y:number}>
  private data: Array<Array<string>>
  private width: number
  private height: number
  private _replaceColor: string
  private targetColor: string

  constructor (data) {
    this.buffer = []
    this.data = data
    this.setSize()
  }

  get replaceColor() {
    return this._replaceColor
  }

  set replaceColor(replaceColor) {
    this._replaceColor = replaceColor
  }

  startPosition (x, y) {
    return ((this.width * y) + x) * 4
  }

  fill (x, y) {
    this.push(x, y)
    this.targetColor = this.data[y][x]

    while (this.buffer.length > 0) {
      const target = this.buffer.pop()
      const x = target.x
      const y = target.y

      // もし置換対象のセルが置換カラーと一緒だったらスキップ
      if (this.data[y][x] === this.replaceColor) {
        continue
      }

      // もし置換対象のセルが元カラーと一緒じゃなかったらスキップ
      if (this.data[y][x] !== this.targetColor) {
        continue
      }

      this.data[y][x] = this.replaceColor

      let rightX = target.x + 1
      while (this.data[y][rightX] === this.targetColor) {
        this.data[y][rightX] = this.replaceColor
        this.pushUpward(rightX, y - 1)
        this.pushDownward(rightX, y + 1)
        rightX++
      }

      let leftX = target.x - 1
      while (this.data[y][leftX] === this.targetColor) {
        this.data[y][leftX] = this.replaceColor
        this.pushUpward(leftX, y - 1)
        this.pushDownward(leftX, y + 1)
        leftX--
      }

      this.pushUpward(x, y - 1)
      this.pushDownward(x, y + 1)
    }
    return this.data
  }

  private setSize () {
    this.height = this.data.length
    this.width = this.data[0].length
  }

  private checkRange (x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }

  private checkUpward (x, y) {
    return y >= 0 && this.data[y][x] === this.targetColor
  }

  private checkDownward (x, y) {
    return y < this.height && this.data[y][x] === this.targetColor
  }

  private pushUpward (x, y) {
    if (this.checkUpward(x, y)) {
      this.push(x, y)
    }
  }

  private pushDownward (x, y) {
    if (this.checkDownward(x, y)) {
      this.push(x, y)
    }
  }

  private push (x, y) {
    if (this.checkRange(x, y)) {
      this.buffer.push({ x: x, y: y })
    }
  }
}
