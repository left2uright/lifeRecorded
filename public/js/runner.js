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
let isLocked = false
let gameRef
let saveThreshold
const gridRefURL = 'https://us-central1-liferecorded-c730f.cloudfunctions.net/getGridRef'
const leaderboardURL = 'https://us-central1-liferecorded-c730f.cloudfunctions.net/getLeaderboard'
const loadGridURL = 'https://us-central1-liferecorded-c730f.cloudfunctions.net/loadGrid'
const leaderBoardInsertURL = 'https://us-central1-liferecorded-c730f.cloudfunctions.net/leaderBoardInsert'

export default {
    run: () => {
        let grid = new Grid(20, 20)

        window.grid = grid
        gridView.createGrid(grid.width, grid.height)
        gridView.displayGrid(grid)

        const tickInput = document.querySelector('#tick')
        const coverageInput = document.querySelector('#coverage')
        const refInput = document.querySelector('#gridRef')
        const stepButton = document.querySelector('#step')
        const genButton = document.querySelector('#generate')
        const resetButton = document.querySelector('#reset')
        const startButton = document.querySelector('#start')
        const stopButton = document.querySelector('#stop')
        const loadButton = document.querySelector('#load')
        const gameRefElement = document.querySelector('#gameRef')
        tickInput.innerHTML = tick


        // Get an available gridRef
        $.get(gridRefURL, (value) => {
            gameRef = value
            gameRefElement.innerHTML = gameRef
        })

        // Get leaderboard and insert into DOM
        $.get(leaderboardURL, (lb) => {
            document.querySelector('#leaderboard-container')
                .innerHTML = lb
        })


        stepButton.addEventListener('click', () => {
            // Set button states
            genButton.setAttribute('disabled', true)
            loadButton.setAttribute('disabled', true)
            grid = grid.iterate()
            gridView.displayGrid(grid)
            window.grid = grid
            isStarted = true
            if (grid.locked) {
                window.clearInterval(gameLoop)
                document.querySelector('#locked')
                    .innerHTML = `Duplicate or empty state reached. Your final score is ${tick}`
                isLocked = true
                lockScreen()
                if (!isLoaded) {
                    $.post(`${leaderBoardInsertURL}`,
                        {
                            "score": tick,
                            "ref": gameRef,
                            "grid": grid.states[0]
                        },
                        (res) => {
                            if (res.isSaved) {
                                document.querySelector('#locked')
                                .innerHTML += `Your score made it on to the leaderboard! As long as it remains in the top ten scores, you can use your game's reference number to load and replay the game!`
                                updateLeaderboard()
                            }
                        })
                }
            } else {
                tick++
                tickInput.innerHTML = tick
            }
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
        })

        resetButton.addEventListener('click', resetGame)

        startButton.addEventListener('click', () => {
            isStarted = true
            isRunning = true
            stepButton.setAttribute('disabled', 'true')
            stopButton.removeAttribute('disabled')
            coverageInput.setAttribute('disabled', 'true')
            genButton.setAttribute('disabled', 'true')
            resetButton.setAttribute('disabled', 'true')
            startButton.setAttribute('disabled', 'true')
            loadButton.setAttribute('disabled', 'true')
            gameLoop = window.setInterval(() => {

                grid = grid.iterate()
                gridView.displayGrid(grid)
                window.grid = grid

                if (grid.locked) {
                    window.clearInterval(gameLoop)
                    document.querySelector('#locked')
                        .innerHTML = `Duplicate or empty state reached. Your final score is ${tick}.`
                    isLocked = true
                    lockScreen()
                    if (!isLoaded) {
                        $.post(`${leaderBoardInsertURL}`,
                            {
                                "score": tick,
                                "ref": gameRef,
                                "grid": grid.states[0]
                            },
                            (res) => {
                                if (res.isSaved) {
                                    document.querySelector('#locked')
                                    .innerHTML += `<br/>Your score made it on to the leaderboard! As long as it remains in the top ten scores, you can use your game's reference number to load and replay the game!`
                                    updateLeaderboard()
                                }
                            })
                    }
                } else {
                    tick++
                    tickInput.innerHTML = tick
                }

            }, 200)
        })

        stopButton.addEventListener('click', () => {
            isRunning = false
            stopButton.setAttribute('disabled', true)
            stepButton.removeAttribute('disabled')
            coverageInput.removeAttribute('disabled')
            resetButton.removeAttribute('disabled')
            startButton.removeAttribute('disabled')
            window.clearInterval(gameLoop)
        })

        const cells = document.querySelectorAll('.cell')
        let isDown = false

        cells.forEach((cell) => {
            cell.addEventListener('mouseover', (ev) => {
                if (isDown && !isStarted && !isLoaded) {
                    let loc = ev.target.id
                    let uRow = parseInt(loc.split('-')[1])
                    let uCol = parseInt(loc.split('-')[2])
                    grid.grid[uRow][uCol] = Number(!grid.grid[uRow][uCol])
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
                if (!isStarted && !isLoaded) {
                    grid.grid[uRow][uCol] = Number(!grid.grid[uRow][uCol])
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
                    if (cell.style.backgroundColor === 'rgb(0, 0, 0)') {
                        activeCount++
                    }
                })
                if ((activeCount === 0) || isRunning || isLocked) {
                    startButton.setAttribute('disabled', true)
                    stepButton.setAttribute('disabled', true)
                } else {
                    stepButton.removeAttribute('disabled')
                    startButton.removeAttribute('disabled')
                }
            }, 100)
        })


        refInput.addEventListener('input', (ev) => {
            if (/^[0-9]{10}$/.test(refInput.value) && !isStarted) {
                loadButton.removeAttribute('disabled')
            } else {
                loadButton.setAttribute('disabled', true)
            }
        })

        coverageInput.addEventListener('input', (ev) => {
            const coverageValue = parseInt(coverageInput.value)
            if (Number.isInteger(coverageValue) && (coverageValue > 0) && coverageValue <= 100 && !isStarted) {
                genButton.removeAttribute('disabled')
            } else {
                genButton.setAttribute('disabled', true)
            }
        })

        loadButton.addEventListener('click', (ev) => {
            const gridRef = document.querySelector('#gridRef').value
            if (/^[0-9]{10}$/.test(gridRef)) {
                window.jQuery.get(`${loadGridURL}?gridRef=${gridRef}`, (data) => {
                    grid = new Grid()
                    grid.grid = data.grid
                    gridView.displayGrid(grid)
                    isLoaded = true
                    gameRef = gridRef
                    gameRefElement.innerHTML = gameRef
                })
            } else {
                const errorEl = document.querySelector('#loadError')
                errorEl.textContent = "The grid reference must be 10 numeric characters"
                window.setTimeout(() => errorEl.textContent = '', 3000)
            }
        })

        function lockScreen() {
            startButton.setAttribute('disabled', true)
            stepButton.setAttribute('disabled', true)
            genButton.setAttribute('disabled', true)
            stopButton.setAttribute('disabled', true)
            loadButton.setAttribute('disabled', true)
            resetButton.removeAttribute('disabled')
        }

        function resetGame() {
            document.location.reload()
        }

        function updateLeaderboard() {
            $.get(leaderboardURL, (lb) => {
                document.querySelector('#leaderboard-container')
                    .innerHTML = lb
            })
        }

    }



}
