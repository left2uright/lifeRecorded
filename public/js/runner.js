import Grid from "./grid"
import gridView from "./gridView"

let tick = 0
let batch = 0
let rate = 1000
let gameLoop
let activeCount = 0
let isStarted = false
let isRunning = false
let isLoaded = false

export default {
    run: () => {
        let grid = new Grid(20,20)

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
        const loadButton = document.querySelector('#load')

        tickInput.innerHTML = tick

        stepButton.addEventListener('click', () => {
            grid = grid.iterate()
            gridView.displayGrid(grid)
            window.grid = grid
            tick++
            tickInput.innerHTML = tick
            isStarted = true
        })

        genButton.addEventListener('click', () => {
            const coveragePercent = document.querySelector('#coverage')
                .value
            const coveragePoints = Math.floor((coveragePercent * grid.width * grid.height) / 100)
            grid = new Grid()
                .randomGrid(coveragePoints || 1)
            gridView.displayGrid(grid)
            window.grid = grid
            tick = 0
            tickInput.innerHTML = tick
            isStarted = false
        })

        resetButton.addEventListener('click', () => {
            grid = new Grid()
            gridView.displayGrid(grid)
            window.grid = grid
            tick = 0
            tickInput.innerHTML = tick
            isStarted = false
        })

        startButton.addEventListener('click', () => {
            isStarted = true
            isRunning = true
            const rounds = document.querySelector('#rounds')
                .value
            let tock = 0
            stepButton.setAttribute('disabled', 'true')
            stopButton.removeAttribute('disabled')
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
            isRunning = false
            stopButton.setAttribute('disabled', true)
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
                if (isDown && !isStarted) {
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
                let loc = ev.target.id
                let uRow = parseInt(loc.split('-')[1])
                let uCol = parseInt(loc.split('-')[2])
                if(!isStarted) {
                    grid.grid[uRow][uCol] = !grid.grid[uRow][uCol]
                }
                gridView.displayGrid(grid)
                window.grid = grid
            })
        })

        document.addEventListener('mouseup', () => {
            window.setTimeout(() => {
                isDown = false
                let cells = document.querySelectorAll('.cell')

                activeCount = 0

                cells.forEach((cell) => {
                    if(cell.style.backgroundColor === 'rgb(0, 0, 0)') {
                        activeCount++
                    }
                })
                if ((activeCount === 0) || isRunning) {
                    startButton.setAttribute('disabled', true)
                    stepButton.setAttribute('disabled', true)
                } else {
                    if(document.querySelector('#rounds').value != '') {
                        startButton.removeAttribute('disabled')
                    }
                    stepButton.removeAttribute('disabled')
                }
            },100)
        })

        roundsInput.addEventListener('input', (ev) => {
            if(document.querySelector('#rounds').value != '' && activeCount) {
                startButton.removeAttribute('disabled')
            } else {
                startButton.setAttribute('disabled', true)
            }
        })

        coverageInput.addEventListener('input', (ev) => {
            if(document.querySelector('#coverage').value != '') {
                genButton.removeAttribute('disabled')
                stepButton.removeAttribute('disabled')
            } else {
                genButton.setAttribute('disabled', true)
                stepButton.setAttribute('disabled', true)
            }
        })

        loadButton.addEventListener('click', (ev) => {
            const gridRef = document.querySelector('#gridRef').value
            if(/^\d\d\d\d\d\d\d\d$/.test(gridRef)) {
                const loadGridURL = `https://us-central1-liferecorded-c730f.cloudfunctions.net/loadGrid?gridRef=${gridRef}`
                window.jQuery.get(loadGridURL, (data) => {
                    grid = new Grid()
                    grid.grid = data
                    gridView.displayGrid(grid)
                    isLoaded = true
                    resetButton.click()
                })
            } else {
                const errorEl = document.querySelector('#loadError')
                errorEl.textContent = "The grid reference must be 8 numeric characters"
                window.setTimeout(() => errorEl.textContent = '', 3000)
            }
        })

        window.testSave = function(ref) {
            const saveURL = `https://us-central1-liferecorded-c730f.cloudfunctions.net/saveGrid`
            jQuery.get(saveURL, {
                gridRef: ref,
                gridValue: grid.grid
            })
        }

    }



}
