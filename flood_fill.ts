class FloodFill {
  private buffer: Array<{x:number, y:number}>
  private data: Array<Array<string>>
  private width: number
  private height: number
  private _replaceColor: string
  private targetColor: string
  private count: number
  private _totalStack: number

  constructor (data) {
    this.buffer = []
    this.data = data
    this.setSize()
    this.count = 1
    this._totalStack = 0
  }

  get replaceColor() {
    return this._replaceColor
  }

  set replaceColor(replaceColor) {
    this._replaceColor = replaceColor
  }

  get totalStack() {
    return this._totalStack
  }

  async slowFill (x, y) {
    this.targetColor = this.data[y][x]
    this.push(x, y)

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
      await this.fillCell(x, y)
      this.push(x, y - 1)
      this.push(x, y + 1)
      this.push(x - 1, y)
      this.push(x + 1, y)
    }
    return this.data
  }

  async fastFill (x, y) {
    this.targetColor = this.data[y][x]
    this.push(x, y)

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
      await this.fillCell(x, y)


      let rightX = target.x + 1
      while (rightX < this.width && this.data[y][rightX] === this.targetColor) {
        this.data[y][rightX] = this.replaceColor
        await this.fillCell(rightX, y)
        this.pushUpward(rightX, y - 1)
        this.pushDownward(rightX, y + 1)
        rightX++
      }

      let leftX = target.x - 1
      while (leftX >= 0 && this.data[y][leftX] === this.targetColor) {
        this.data[y][leftX] = this.replaceColor
        await this.fillCell(leftX, y)
        this.pushUpward(leftX, y - 1)
        this.pushDownward(leftX, y + 1)
        leftX--
      }
      this.pushUpward(x, y - 1)
      this.pushDownward(x, y + 1)
    }
    return this.data
  }

  private sleep () {
    return new Promise((resolve) => setTimeout(resolve, 200));
  }

  private async fillCell (x, y) {
    await this.sleep()
    const elm = document.getElementById(`cell-${x}-${y}`)
    elm.dataset.value = this._replaceColor
    elm.innerText = String(this.count)
    this.count++
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
    if (this.checkRange(x, y) && this.data[y][x] === this.targetColor) {
      const elm = document.getElementById(`cell-${x}-${y}`)
      elm.dataset.stack_count = String(Number(elm.dataset.stack_count) + 1)
      elm.classList.add('fade-in')
      this.buffer.push({ x: x, y: y })
      this._totalStack++
    }
  }
}
