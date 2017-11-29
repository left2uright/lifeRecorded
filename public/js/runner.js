import Grid from "./grid"
import gridView from "./gridView"

let tick = 0
let batch = 0
let rate = 1000
let gameLoop

export default {
    run: () => {
        let grid = new Grid() //.randomGrid(200)
        // flipper
        // grid.grid[2][2] = 1
        // grid.grid[3][2] = 1
        // grid.grid[4][2] = 1

        // box
        grid.grid[2][2] = 1
        grid.grid[3][2] = 1
        grid.grid[4][2] = 1
        grid.grid[2][3] = 1
        grid.grid[3][3] = 1
        grid.grid[4][3] = 1
        grid.grid[2][4] = 1
        grid.grid[3][4] = 1
        grid.grid[4][4] = 1


        window.grid = grid
        gridView.createGrid(grid.width, grid.height)
        gridView.displayGrid(grid)

        const tickInput = document.querySelector('#tick')
        const roundsInput = document.querySelector('#rounds')
        const coverageInput = document.querySelector('#coverage')
        const stepButton = document.querySelector('#step')
        const genButton = document.querySelector('#generate')
        const resetButton = document.querySelector('#reset')
        const startButton = document.querySelector('#start')
        const stopButton = document.querySelector('#stop')

        tickInput.innerHTML = tick

        stepButton.addEventListener('click', () => {
            grid = grid.iterate()
            gridView.displayGrid(grid)
            window.grid = grid
            tick++
            tickInput.innerHTML = tick
        })

        genButton.addEventListener('click', () => {
            const coveragePercent = document.querySelector('#coverage')
                .value
            const coveragePoints = Math.floor((coveragePercent * grid.width * grid.height) / 100)
            grid = new Grid()
                .randomGrid(coveragePoints || 1)
            gridView.displayGrid(grid)
            window.grid = grid
        })

        resetButton.addEventListener('click', () => {
            grid = new Grid()
            gridView.displayGrid(grid)
            window.grid = grid
        })

        startButton.addEventListener('click', () => {
            const rounds = document.querySelector('#rounds')
                .value
            let tock = 0
            stepButton.setAttribute('disabled', 'true')
            roundsInput.setAttribute('disabled', 'true')
            coverageInput.setAttribute('disabled', 'true')
            genButton.setAttribute('disabled', 'true')
            resetButton.setAttribute('disabled', 'true')
            startButton.setAttribute('disabled', 'true')

            gameLoop = window.setInterval(() => {
                if (tock < rounds) {
                    grid = grid.iterate()
                    gridView.displayGrid(grid)
                    window.grid = grid
                    tick++
                    tock++
                    tickInput.innerHTML = tick
                } else {
                    window.clearInterval(gameLoop)
                    stopButton.click()
                }
            }, 800)
        })

        stopButton.addEventListener('click', () => {
            stepButton.removeAttribute('disabled')
            roundsInput.removeAttribute('disabled')
            coverageInput.removeAttribute('disabled')
            genButton.removeAttribute('disabled')
            resetButton.removeAttribute('disabled')
            startButton.removeAttribute('disabled')
            window.clearInterval(gameLoop)
        })

        const cells = document.querySelectorAll('.cell')
        let isDown = false

        cells.forEach((cell) => {
            cell.addEventListener('mouseover', (ev) => {
                if (isDown) {
                    let loc = ev.target.id
                    let uRow = parseInt(loc.split('-')[1])
                    let uCol = parseInt(loc.split('-')[2])
                    grid.grid[uRow][uCol] = !grid.grid[uRow][uCol]
                    gridView.displayGrid(grid)
                    window.grid = grid
                }
            })
        })

        cells.forEach((cell) => {
            cell.addEventListener('mousedown', (ev) => {
                isDown = true
            })
        })

        document.addEventListener('mouseup', () => {
            isDown = false
        })


    }



}
