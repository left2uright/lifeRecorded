class Grid {

    constructor(height, width) {
        const DEFAULT_HEIGHT = 20
        const DEFAULT_WIDTH = 20
        this.height = height || DEFAULT_HEIGHT
        this.width = width || DEFAULT_WIDTH
        this.grid = this.buildGrid()

    }

    buildGrid() {
        let grid = []
        for (let row = 0; row < this.width; row++) {
            let point = []
            for (let col = 0; col < this.height; col++) {
                point.push(0)
            }
            grid.push(point)
        }

        return grid
    }

    randomGrid(marks) {
        // Grid size
        var height = this.height
        var width = this.width

        var liveCells = marks

        var filledGrid = new Grid(height, width)

        while (liveCells > 0) {
            var row = Math.floor((Math.random() * height))
            var col = Math.floor((Math.random() * width))
            if (filledGrid.grid[row][col] === 0) {
                filledGrid.grid[row][col] = 1
                liveCells--
            }
        }

        return filledGrid
    }

    iterate() {
        const updatedGrid = new Grid(this.height, this.width)
        for (var row = 0; row < this.height; row++) {
            for (var col = 0; col < this.width; col++) {
                var neighborCount = this.getNeighborCount(row, col)
                if (neighborCount === 3) {
                    updatedGrid.grid[row][col] = 1
                } else if ((neighborCount === 2) && (this.grid[row][col] === 1)) {
                    updatedGrid.grid[row][col] = 1
                }
            }
        }

        return updatedGrid
    }

    getNeighborCount(row, col) {
        var count = 0
        var nRow, nCol

        // Upper left
        nRow = (row - 1) > -1 ? row - 1 : this.height - 1
        nCol = (col - 1) > -1 ? col - 1 : this.width - 1
        if(this.grid[nRow][nCol]) {
            count++
        }

        // Upper
        nRow = (row - 1) > -1 ? row - 1 : this.height - 1
        nCol = col
        if(this.grid[nRow][nCol]) {
            count++
        }

        // Upper right
        nRow = (row - 1) > -1 ? row - 1 : this.height - 1
        nCol = (col + 1) < this.width ? (col + 1) : 0
        if(this.grid[nRow][nCol]) {
            count++
        }

        // left
        nRow = row
        nCol = (col - 1) > -1 ? col - 1 : this.width - 1
        if(this.grid[nRow][nCol]) {
            count++
        }

        // right
        nRow = row
        nCol = (col + 1) < this.width ? (col + 1) : 0
        if(this.grid[nRow][nCol]) {
            count++
        }

        // Lower left
        nRow = (row + 1) < this.height ? (row + 1) : 0
        nCol = (col - 1) > -1 ? col - 1 : this.width - 1
        if(this.grid[nRow][nCol]) {
            count++
        }

        // Lower
        nRow = (row + 1) < this.height ? (row + 1) : 0
        nCol = col
        if(this.grid[nRow][nCol]) {
            count++
        }

        // Lower right
        nRow = (row + 1) < this.height ? (row + 1) : 0
        nCol = (col + 1) < this.width ? (col + 1) : 0
        if(this.grid[nRow][nCol]) {
            count++
        }
        return count
    }
}

export default Grid
