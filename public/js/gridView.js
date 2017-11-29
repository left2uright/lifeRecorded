export default {

    displayGrid: (grid) => {
        var height = grid.height
        var width = grid.width

        for (var row = 0; row < height; row++) {
            for (var col = 0; col < width; col++) {
                try {
                    var el = document.querySelector(`#cell-${row}-${col}`)
                    if (grid.grid[row][col]) {
                        el.style.backgroundColor = "#000000"
                    } else {
                        el.style.backgroundColor = "#aaaaaa"
                    }
                } catch (e) {
                    console.log(`Error setting view for plot ${row},${col}: ${e}`)
                }
            }
        }
    },

    createGrid: (width,height) => {
        let table = document.querySelector('#grid')
        for (var row = 0; row < height; row++) {
            const currentRow = document.createElement('tr')
            currentRow.id = `row-${row}`
            for (var col = 0; col < width; col++) {
                const cell = document.createElement('td')
                cell.id = `cell-${row}-${col}`
                cell.className = `cell`
                currentRow.appendChild(cell)
            }
            table.appendChild(currentRow)
        }
    }

}
