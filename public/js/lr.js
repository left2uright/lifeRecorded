/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__runner__ = __webpack_require__(1);


__WEBPACK_IMPORTED_MODULE_0__runner__["a" /* default */].run()


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__grid__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gridView__ = __webpack_require__(3);



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

/* harmony default export */ __webpack_exports__["a"] = ({
    run: () => {
        let grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */](20, 20)

        window.grid = grid
        __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].createGrid(grid.width, grid.height)
        __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)

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
            __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
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
            grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */]()
                .randomGrid(coveragePoints || 1)
            __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
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
                __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
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
                    __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
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
                __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
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
                    grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */]()
                    grid.grid = data.grid
                    __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
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



});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Grid {

    constructor(height, width) {
        const DEFAULT_HEIGHT = 20
        const DEFAULT_WIDTH = 20
        this.height = height || DEFAULT_HEIGHT
        this.width = width || DEFAULT_WIDTH
        this.states = []
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
        this.states.push(this.grid.slice())
        const updatedGrid = new Grid(this.height, this.width)
        updatedGrid.states = this.states
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

        if (this.isDuplicateGrid(updatedGrid) || this.isEmptyGrid(updatedGrid)) {
            updatedGrid.locked = true
        }

        return updatedGrid
    }

    isEmptyGrid(next) {
        let isEmpty = false
        if (/0{400}/.test(this.stringifyGrid(next.grid))) {
            isEmpty = true
        }
        return isEmpty
    }

    isDuplicateGrid(next) {
        let isDup = false
        const nextString = this.stringifyGrid(next.grid)
        this.states.forEach((prevGrid) => {
            if (this.stringifyGrid(prevGrid) === nextString) {
                isDup = true
            }
        })
        return isDup
    }

    stringifyGrid(gridToString) {
        return gridToString.map((row) => {
            return row.join('')
        }).join('')
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

/* harmony default export */ __webpack_exports__["a"] = (Grid);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({

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

});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDAxZGJjMzkyYzU0NjMxNjEzZTUiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ydW5uZXIuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyaWQuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyaWRWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzdEQTs7QUFFQTs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7O0FBR1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBGQUEwRixLQUFLO0FBQy9GO0FB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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDNUpBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx5QkFBeUIsY0FBYztBQUN2Qyw2QkFBNkIsYUFBYTtBQUMxQztBQUNBLDZEQUE2RCxJQUFJLEdBQUcsSUFBSTtBQUN4RTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsK0RBQStELElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtBQUNoRjtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSx5QkFBeUIsY0FBYztBQUN2QztBQUNBLG1DQUFtQyxJQUFJO0FBQ3ZDLDZCQUE2QixhQUFhO0FBQzFDO0FBQ0Esa0NBQWtDLElBQUksR0FBRyxJQUFJO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJsci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGQwMWRiYzM5MmM1NDYzMTYxM2U1IiwiaW1wb3J0IHJ1bm5lciBmcm9tIFwiLi9ydW5uZXJcIlxuXG5ydW5uZXIucnVuKClcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBHcmlkIGZyb20gXCIuL2dyaWRcIlxuaW1wb3J0IGdyaWRWaWV3IGZyb20gXCIuL2dyaWRWaWV3XCJcblxubGV0IHRpY2sgPSAwXG5sZXQgYmF0Y2ggPSAwXG5sZXQgcmF0ZSA9IDEwMDBcbmxldCBnYW1lTG9vcFxubGV0IGFjdGl2ZUNvdW50ID0gMFxubGV0IGlzU3RhcnRlZCA9IGZhbHNlXG5sZXQgaXNSdW5uaW5nID0gZmFsc2VcbmxldCBpc0xvYWRlZCA9IGZhbHNlXG5sZXQgaXNMb2NrZWQgPSBmYWxzZVxubGV0IGdhbWVSZWZcbmxldCBzYXZlVGhyZXNob2xkXG5jb25zdCBncmlkUmVmVVJMID0gJ2h0dHBzOi8vdXMtY2VudHJhbDEtbGlmZXJlY29yZGVkLWM3MzBmLmNsb3VkZnVuY3Rpb25zLm5ldC9nZXRHcmlkUmVmJ1xuY29uc3QgbGVhZGVyYm9hcmRVUkwgPSAnaHR0cHM6Ly91cy1jZW50cmFsMS1saWZlcmVjb3JkZWQtYzczMGYuY2xvdWRmdW5jdGlvbnMubmV0L2dldExlYWRlcmJvYXJkJ1xuY29uc3QgbG9hZEdyaWRVUkwgPSAnaHR0cHM6Ly91cy1jZW50cmFsMS1saWZlcmVjb3JkZWQtYzczMGYuY2xvdWRmdW5jdGlvbnMubmV0L2xvYWRHcmlkJ1xuY29uc3QgbGVhZGVyQm9hcmRJbnNlcnRVUkwgPSAnaHR0cHM6Ly91cy1jZW50cmFsMS1saWZlcmVjb3JkZWQtYzczMGYuY2xvdWRmdW5jdGlvbnMubmV0L2xlYWRlckJvYXJkSW5zZXJ0J1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcnVuOiAoKSA9PiB7XG4gICAgICAgIGxldCBncmlkID0gbmV3IEdyaWQoMjAsIDIwKVxuXG4gICAgICAgIHdpbmRvdy5ncmlkID0gZ3JpZFxuICAgICAgICBncmlkVmlldy5jcmVhdGVHcmlkKGdyaWQud2lkdGgsIGdyaWQuaGVpZ2h0KVxuICAgICAgICBncmlkVmlldy5kaXNwbGF5R3JpZChncmlkKVxuXG4gICAgICAgIGNvbnN0IHRpY2tJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0aWNrJylcbiAgICAgICAgY29uc3QgY292ZXJhZ2VJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb3ZlcmFnZScpXG4gICAgICAgIGNvbnN0IHJlZklucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dyaWRSZWYnKVxuICAgICAgICBjb25zdCBzdGVwQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0ZXAnKVxuICAgICAgICBjb25zdCBnZW5CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ2VuZXJhdGUnKVxuICAgICAgICBjb25zdCByZXNldEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyZXNldCcpXG4gICAgICAgIGNvbnN0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0YXJ0JylcbiAgICAgICAgY29uc3Qgc3RvcEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdG9wJylcbiAgICAgICAgY29uc3QgbG9hZEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2FkJylcbiAgICAgICAgY29uc3QgZ2FtZVJlZkVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ2FtZVJlZicpXG4gICAgICAgIHRpY2tJbnB1dC5pbm5lckhUTUwgPSB0aWNrXG5cblxuICAgICAgICAvLyBHZXQgYW4gYXZhaWxhYmxlIGdyaWRSZWZcbiAgICAgICAgJC5nZXQoZ3JpZFJlZlVSTCwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBnYW1lUmVmID0gdmFsdWVcbiAgICAgICAgICAgIGdhbWVSZWZFbGVtZW50LmlubmVySFRNTCA9IGdhbWVSZWZcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBHZXQgbGVhZGVyYm9hcmQgYW5kIGluc2VydCBpbnRvIERPTVxuICAgICAgICAkLmdldChsZWFkZXJib2FyZFVSTCwgKGxiKSA9PiB7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbGVhZGVyYm9hcmQtY29udGFpbmVyJylcbiAgICAgICAgICAgICAgICAuaW5uZXJIVE1MID0gbGJcbiAgICAgICAgfSlcblxuXG4gICAgICAgIHN0ZXBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBTZXQgYnV0dG9uIHN0YXRlc1xuICAgICAgICAgICAgZ2VuQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgbG9hZEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICAgICAgICAgIGdyaWQgPSBncmlkLml0ZXJhdGUoKVxuICAgICAgICAgICAgZ3JpZFZpZXcuZGlzcGxheUdyaWQoZ3JpZClcbiAgICAgICAgICAgIHdpbmRvdy5ncmlkID0gZ3JpZFxuICAgICAgICAgICAgaXNTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgICAgaWYgKGdyaWQubG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwoZ2FtZUxvb3ApXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2tlZCcpXG4gICAgICAgICAgICAgICAgICAgIC5pbm5lckhUTUwgPSBgRHVwbGljYXRlIG9yIGVtcHR5IHN0YXRlIHJlYWNoZWQuIFlvdXIgZmluYWwgc2NvcmUgaXMgJHt0aWNrfWBcbiAgICAgICAgICAgICAgICBpc0xvY2tlZCA9IHRydWVcbiAgICAgICAgICAgICAgICBsb2NrU2NyZWVuKClcbiAgICAgICAgICAgICAgICBpZiAoIWlzTG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICQucG9zdChgJHtsZWFkZXJCb2FyZEluc2VydFVSTH1gLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2NvcmVcIjogdGljayxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInJlZlwiOiBnYW1lUmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ3JpZFwiOiBncmlkLnN0YXRlc1swXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmlzU2F2ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvY2tlZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbm5lckhUTUwgKz0gYFlvdXIgc2NvcmUgbWFkZSBpdCBvbiB0byB0aGUgbGVhZGVyYm9hcmQhIEFzIGxvbmcgYXMgaXQgcmVtYWlucyBpbiB0aGUgdG9wIHRlbiBzY29yZXMsIHlvdSBjYW4gdXNlIHlvdXIgZ2FtZSdzIHJlZmVyZW5jZSBudW1iZXIgdG8gbG9hZCBhbmQgcmVwbGF5IHRoZSBnYW1lIWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlTGVhZGVyYm9hcmQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aWNrKytcbiAgICAgICAgICAgICAgICB0aWNrSW5wdXQuaW5uZXJIVE1MID0gdGlja1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG5cbiAgICAgICAgZ2VuQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY292ZXJhZ2VQZXJjZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvdmVyYWdlJylcbiAgICAgICAgICAgICAgICAudmFsdWVcbiAgICAgICAgICAgIGNvbnN0IGNvdmVyYWdlUG9pbnRzID0gTWF0aC5mbG9vcigoY292ZXJhZ2VQZXJjZW50ICogZ3JpZC53aWR0aCAqIGdyaWQuaGVpZ2h0KSAvIDEwMClcbiAgICAgICAgICAgIGdyaWQgPSBuZXcgR3JpZCgpXG4gICAgICAgICAgICAgICAgLnJhbmRvbUdyaWQoY292ZXJhZ2VQb2ludHMgfHwgMSlcbiAgICAgICAgICAgIGdyaWRWaWV3LmRpc3BsYXlHcmlkKGdyaWQpXG4gICAgICAgICAgICB3aW5kb3cuZ3JpZCA9IGdyaWRcbiAgICAgICAgICAgIHRpY2sgPSAwXG4gICAgICAgICAgICB0aWNrSW5wdXQuaW5uZXJIVE1MID0gdGlja1xuICAgICAgICB9KVxuXG4gICAgICAgIHJlc2V0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzZXRHYW1lKVxuXG4gICAgICAgIHN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgaXNTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgICAgaXNSdW5uaW5nID0gdHJ1ZVxuICAgICAgICAgICAgc3RlcEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKVxuICAgICAgICAgICAgc3RvcEJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIGNvdmVyYWdlSW5wdXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICd0cnVlJylcbiAgICAgICAgICAgIGdlbkJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKVxuICAgICAgICAgICAgcmVzZXRCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICd0cnVlJylcbiAgICAgICAgICAgIHN0YXJ0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgICAgICAgICBsb2FkQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgICAgICAgICBnYW1lTG9vcCA9IHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBncmlkID0gZ3JpZC5pdGVyYXRlKClcbiAgICAgICAgICAgICAgICBncmlkVmlldy5kaXNwbGF5R3JpZChncmlkKVxuICAgICAgICAgICAgICAgIHdpbmRvdy5ncmlkID0gZ3JpZFxuXG4gICAgICAgICAgICAgICAgaWYgKGdyaWQubG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKGdhbWVMb29wKVxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9ja2VkJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5pbm5lckhUTUwgPSBgRHVwbGljYXRlIG9yIGVtcHR5IHN0YXRlIHJlYWNoZWQuIFlvdXIgZmluYWwgc2NvcmUgaXMgJHt0aWNrfS5gXG4gICAgICAgICAgICAgICAgICAgIGlzTG9ja2VkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBsb2NrU2NyZWVuKClcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0xvYWRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5wb3N0KGAke2xlYWRlckJvYXJkSW5zZXJ0VVJMfWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNjb3JlXCI6IHRpY2ssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVmXCI6IGdhbWVSZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZ3JpZFwiOiBncmlkLnN0YXRlc1swXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmlzU2F2ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2NrZWQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmlubmVySFRNTCArPSBgPGJyLz5Zb3VyIHNjb3JlIG1hZGUgaXQgb24gdG8gdGhlIGxlYWRlcmJvYXJkISBBcyBsb25nIGFzIGl0IHJlbWFpbnMgaW4gdGhlIHRvcCB0ZW4gc2NvcmVzLCB5b3UgY2FuIHVzZSB5b3VyIGdhbWUncyByZWZlcmVuY2UgbnVtYmVyIHRvIGxvYWQgYW5kIHJlcGxheSB0aGUgZ2FtZSFgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVMZWFkZXJib2FyZCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGljaysrXG4gICAgICAgICAgICAgICAgICAgIHRpY2tJbnB1dC5pbm5lckhUTUwgPSB0aWNrXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LCAyMDApXG4gICAgICAgIH0pXG5cbiAgICAgICAgc3RvcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGlzUnVubmluZyA9IGZhbHNlXG4gICAgICAgICAgICBzdG9wQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgc3RlcEJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIGNvdmVyYWdlSW5wdXQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICByZXNldEJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIHN0YXJ0QnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgICAgICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwoZ2FtZUxvb3ApXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgY2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2VsbCcpXG4gICAgICAgIGxldCBpc0Rvd24gPSBmYWxzZVxuXG4gICAgICAgIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGlzRG93biAmJiAhaXNTdGFydGVkICYmICFpc0xvYWRlZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbG9jID0gZXYudGFyZ2V0LmlkXG4gICAgICAgICAgICAgICAgICAgIGxldCB1Um93ID0gcGFyc2VJbnQobG9jLnNwbGl0KCctJylbMV0pXG4gICAgICAgICAgICAgICAgICAgIGxldCB1Q29sID0gcGFyc2VJbnQobG9jLnNwbGl0KCctJylbMl0pXG4gICAgICAgICAgICAgICAgICAgIGdyaWQuZ3JpZFt1Um93XVt1Q29sXSA9IE51bWJlcighZ3JpZC5ncmlkW3VSb3ddW3VDb2xdKVxuICAgICAgICAgICAgICAgICAgICBncmlkVmlldy5kaXNwbGF5R3JpZChncmlkKVxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZ3JpZCA9IGdyaWRcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIGNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGV2KSA9PiB7XG4gICAgICAgICAgICAgICAgaXNEb3duID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGxldCBsb2MgPSBldi50YXJnZXQuaWRcbiAgICAgICAgICAgICAgICBsZXQgdVJvdyA9IHBhcnNlSW50KGxvYy5zcGxpdCgnLScpWzFdKVxuICAgICAgICAgICAgICAgIGxldCB1Q29sID0gcGFyc2VJbnQobG9jLnNwbGl0KCctJylbMl0pXG4gICAgICAgICAgICAgICAgaWYgKCFpc1N0YXJ0ZWQgJiYgIWlzTG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyaWQuZ3JpZFt1Um93XVt1Q29sXSA9IE51bWJlcighZ3JpZC5ncmlkW3VSb3ddW3VDb2xdKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBncmlkVmlldy5kaXNwbGF5R3JpZChncmlkKVxuICAgICAgICAgICAgICAgIHdpbmRvdy5ncmlkID0gZ3JpZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlzRG93biA9IGZhbHNlXG4gICAgICAgICAgICAgICAgbGV0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNlbGwnKVxuXG4gICAgICAgICAgICAgICAgYWN0aXZlQ291bnQgPSAwXG5cbiAgICAgICAgICAgICAgICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9PT0gJ3JnYigwLCAwLCAwKScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNvdW50KytcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKChhY3RpdmVDb3VudCA9PT0gMCkgfHwgaXNSdW5uaW5nIHx8IGlzTG9ja2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICBzdGVwQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ZXBCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0QnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEwMClcbiAgICAgICAgfSlcblxuXG4gICAgICAgIHJlZklucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2KSA9PiB7XG4gICAgICAgICAgICBpZiAoL15bMC05XXsxMH0kLy50ZXN0KHJlZklucHV0LnZhbHVlKSAmJiAhaXNTdGFydGVkKSB7XG4gICAgICAgICAgICAgICAgbG9hZEJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9hZEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBjb3ZlcmFnZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb3ZlcmFnZVZhbHVlID0gcGFyc2VJbnQoY292ZXJhZ2VJbnB1dC52YWx1ZSlcbiAgICAgICAgICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGNvdmVyYWdlVmFsdWUpICYmIChjb3ZlcmFnZVZhbHVlID4gMCkgJiYgY292ZXJhZ2VWYWx1ZSA8PSAxMDAgJiYgIWlzU3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIGdlbkJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZ2VuQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGxvYWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGdyaWRSZWYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZFJlZicpLnZhbHVlXG4gICAgICAgICAgICBpZiAoL15bMC05XXsxMH0kLy50ZXN0KGdyaWRSZWYpKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmpRdWVyeS5nZXQoYCR7bG9hZEdyaWRVUkx9P2dyaWRSZWY9JHtncmlkUmVmfWAsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGdyaWQgPSBuZXcgR3JpZCgpXG4gICAgICAgICAgICAgICAgICAgIGdyaWQuZ3JpZCA9IGRhdGEuZ3JpZFxuICAgICAgICAgICAgICAgICAgICBncmlkVmlldy5kaXNwbGF5R3JpZChncmlkKVxuICAgICAgICAgICAgICAgICAgICBpc0xvYWRlZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgZ2FtZVJlZiA9IGdyaWRSZWZcbiAgICAgICAgICAgICAgICAgICAgZ2FtZVJlZkVsZW1lbnQuaW5uZXJIVE1MID0gZ2FtZVJlZlxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yRWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9hZEVycm9yJylcbiAgICAgICAgICAgICAgICBlcnJvckVsLnRleHRDb250ZW50ID0gXCJUaGUgZ3JpZCByZWZlcmVuY2UgbXVzdCBiZSAxMCBudW1lcmljIGNoYXJhY3RlcnNcIlxuICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IGVycm9yRWwudGV4dENvbnRlbnQgPSAnJywgMzAwMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBmdW5jdGlvbiBsb2NrU2NyZWVuKCkge1xuICAgICAgICAgICAgc3RhcnRCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgICAgICAgICBzdGVwQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgZ2VuQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgc3RvcEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICAgICAgICAgIGxvYWRCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgICAgICAgICByZXNldEJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHJlc2V0R2FtZSgpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVMZWFkZXJib2FyZCgpIHtcbiAgICAgICAgICAgICQuZ2V0KGxlYWRlcmJvYXJkVVJMLCAobGIpID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbGVhZGVyYm9hcmQtY29udGFpbmVyJylcbiAgICAgICAgICAgICAgICAgICAgLmlubmVySFRNTCA9IGxiXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ydW5uZXIuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgR3JpZCB7XG5cbiAgICBjb25zdHJ1Y3RvcihoZWlnaHQsIHdpZHRoKSB7XG4gICAgICAgIGNvbnN0IERFRkFVTFRfSEVJR0hUID0gMjBcbiAgICAgICAgY29uc3QgREVGQVVMVF9XSURUSCA9IDIwXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0IHx8IERFRkFVTFRfSEVJR0hUXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aCB8fCBERUZBVUxUX1dJRFRIXG4gICAgICAgIHRoaXMuc3RhdGVzID0gW11cbiAgICAgICAgdGhpcy5ncmlkID0gdGhpcy5idWlsZEdyaWQoKVxuXG4gICAgfVxuXG4gICAgYnVpbGRHcmlkKCkge1xuICAgICAgICBsZXQgZ3JpZCA9IFtdXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMud2lkdGg7IHJvdysrKSB7XG4gICAgICAgICAgICBsZXQgcG9pbnQgPSBbXVxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5oZWlnaHQ7IGNvbCsrKSB7XG4gICAgICAgICAgICAgICAgcG9pbnQucHVzaCgwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ3JpZC5wdXNoKHBvaW50KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdyaWRcbiAgICB9XG5cbiAgICByYW5kb21HcmlkKG1hcmtzKSB7XG4gICAgICAgIC8vIEdyaWQgc2l6ZVxuICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5oZWlnaHRcbiAgICAgICAgdmFyIHdpZHRoID0gdGhpcy53aWR0aFxuXG4gICAgICAgIHZhciBsaXZlQ2VsbHMgPSBtYXJrc1xuXG4gICAgICAgIHZhciBmaWxsZWRHcmlkID0gbmV3IEdyaWQoaGVpZ2h0LCB3aWR0aClcblxuICAgICAgICB3aGlsZSAobGl2ZUNlbGxzID4gMCkge1xuICAgICAgICAgICAgdmFyIHJvdyA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiBoZWlnaHQpKVxuICAgICAgICAgICAgdmFyIGNvbCA9IE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiB3aWR0aCkpXG4gICAgICAgICAgICBpZiAoZmlsbGVkR3JpZC5ncmlkW3Jvd11bY29sXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGZpbGxlZEdyaWQuZ3JpZFtyb3ddW2NvbF0gPSAxXG4gICAgICAgICAgICAgICAgbGl2ZUNlbGxzLS1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxsZWRHcmlkXG4gICAgfVxuXG4gICAgaXRlcmF0ZSgpIHtcbiAgICAgICAgdGhpcy5zdGF0ZXMucHVzaCh0aGlzLmdyaWQuc2xpY2UoKSlcbiAgICAgICAgY29uc3QgdXBkYXRlZEdyaWQgPSBuZXcgR3JpZCh0aGlzLmhlaWdodCwgdGhpcy53aWR0aClcbiAgICAgICAgdXBkYXRlZEdyaWQuc3RhdGVzID0gdGhpcy5zdGF0ZXNcbiAgICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgdGhpcy5oZWlnaHQ7IHJvdysrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCB0aGlzLndpZHRoOyBjb2wrKykge1xuICAgICAgICAgICAgICAgIHZhciBuZWlnaGJvckNvdW50ID0gdGhpcy5nZXROZWlnaGJvckNvdW50KHJvdywgY29sKVxuICAgICAgICAgICAgICAgIGlmIChuZWlnaGJvckNvdW50ID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRHcmlkLmdyaWRbcm93XVtjb2xdID0gMVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKG5laWdoYm9yQ291bnQgPT09IDIpICYmICh0aGlzLmdyaWRbcm93XVtjb2xdID09PSAxKSkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkR3JpZC5ncmlkW3Jvd11bY29sXSA9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0R1cGxpY2F0ZUdyaWQodXBkYXRlZEdyaWQpIHx8IHRoaXMuaXNFbXB0eUdyaWQodXBkYXRlZEdyaWQpKSB7XG4gICAgICAgICAgICB1cGRhdGVkR3JpZC5sb2NrZWQgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdXBkYXRlZEdyaWRcbiAgICB9XG5cbiAgICBpc0VtcHR5R3JpZChuZXh0KSB7XG4gICAgICAgIGxldCBpc0VtcHR5ID0gZmFsc2VcbiAgICAgICAgaWYgKC8wezQwMH0vLnRlc3QodGhpcy5zdHJpbmdpZnlHcmlkKG5leHQuZ3JpZCkpKSB7XG4gICAgICAgICAgICBpc0VtcHR5ID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpc0VtcHR5XG4gICAgfVxuXG4gICAgaXNEdXBsaWNhdGVHcmlkKG5leHQpIHtcbiAgICAgICAgbGV0IGlzRHVwID0gZmFsc2VcbiAgICAgICAgY29uc3QgbmV4dFN0cmluZyA9IHRoaXMuc3RyaW5naWZ5R3JpZChuZXh0LmdyaWQpXG4gICAgICAgIHRoaXMuc3RhdGVzLmZvckVhY2goKHByZXZHcmlkKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdHJpbmdpZnlHcmlkKHByZXZHcmlkKSA9PT0gbmV4dFN0cmluZykge1xuICAgICAgICAgICAgICAgIGlzRHVwID0gdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gaXNEdXBcbiAgICB9XG5cbiAgICBzdHJpbmdpZnlHcmlkKGdyaWRUb1N0cmluZykge1xuICAgICAgICByZXR1cm4gZ3JpZFRvU3RyaW5nLm1hcCgocm93KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcm93LmpvaW4oJycpXG4gICAgICAgIH0pLmpvaW4oJycpXG4gICAgfVxuXG4gICAgZ2V0TmVpZ2hib3JDb3VudChyb3csIGNvbCkge1xuICAgICAgICB2YXIgY291bnQgPSAwXG4gICAgICAgIHZhciBuUm93LCBuQ29sXG5cbiAgICAgICAgLy8gVXBwZXIgbGVmdFxuICAgICAgICBuUm93ID0gKHJvdyAtIDEpID4gLTEgPyByb3cgLSAxIDogdGhpcy5oZWlnaHQgLSAxXG4gICAgICAgIG5Db2wgPSAoY29sIC0gMSkgPiAtMSA/IGNvbCAtIDEgOiB0aGlzLndpZHRoIC0gMVxuICAgICAgICBpZih0aGlzLmdyaWRbblJvd11bbkNvbF0pIHtcbiAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwcGVyXG4gICAgICAgIG5Sb3cgPSAocm93IC0gMSkgPiAtMSA/IHJvdyAtIDEgOiB0aGlzLmhlaWdodCAtIDFcbiAgICAgICAgbkNvbCA9IGNvbFxuICAgICAgICBpZih0aGlzLmdyaWRbblJvd11bbkNvbF0pIHtcbiAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwcGVyIHJpZ2h0XG4gICAgICAgIG5Sb3cgPSAocm93IC0gMSkgPiAtMSA/IHJvdyAtIDEgOiB0aGlzLmhlaWdodCAtIDFcbiAgICAgICAgbkNvbCA9IChjb2wgKyAxKSA8IHRoaXMud2lkdGggPyAoY29sICsgMSkgOiAwXG4gICAgICAgIGlmKHRoaXMuZ3JpZFtuUm93XVtuQ29sXSkge1xuICAgICAgICAgICAgY291bnQrK1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGVmdFxuICAgICAgICBuUm93ID0gcm93XG4gICAgICAgIG5Db2wgPSAoY29sIC0gMSkgPiAtMSA/IGNvbCAtIDEgOiB0aGlzLndpZHRoIC0gMVxuICAgICAgICBpZih0aGlzLmdyaWRbblJvd11bbkNvbF0pIHtcbiAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJpZ2h0XG4gICAgICAgIG5Sb3cgPSByb3dcbiAgICAgICAgbkNvbCA9IChjb2wgKyAxKSA8IHRoaXMud2lkdGggPyAoY29sICsgMSkgOiAwXG4gICAgICAgIGlmKHRoaXMuZ3JpZFtuUm93XVtuQ29sXSkge1xuICAgICAgICAgICAgY291bnQrK1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTG93ZXIgbGVmdFxuICAgICAgICBuUm93ID0gKHJvdyArIDEpIDwgdGhpcy5oZWlnaHQgPyAocm93ICsgMSkgOiAwXG4gICAgICAgIG5Db2wgPSAoY29sIC0gMSkgPiAtMSA/IGNvbCAtIDEgOiB0aGlzLndpZHRoIC0gMVxuICAgICAgICBpZih0aGlzLmdyaWRbblJvd11bbkNvbF0pIHtcbiAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvd2VyXG4gICAgICAgIG5Sb3cgPSAocm93ICsgMSkgPCB0aGlzLmhlaWdodCA/IChyb3cgKyAxKSA6IDBcbiAgICAgICAgbkNvbCA9IGNvbFxuICAgICAgICBpZih0aGlzLmdyaWRbblJvd11bbkNvbF0pIHtcbiAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvd2VyIHJpZ2h0XG4gICAgICAgIG5Sb3cgPSAocm93ICsgMSkgPCB0aGlzLmhlaWdodCA/IChyb3cgKyAxKSA6IDBcbiAgICAgICAgbkNvbCA9IChjb2wgKyAxKSA8IHRoaXMud2lkdGggPyAoY29sICsgMSkgOiAwXG4gICAgICAgIGlmKHRoaXMuZ3JpZFtuUm93XVtuQ29sXSkge1xuICAgICAgICAgICAgY291bnQrK1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3JpZFxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvZ3JpZC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCB7XG5cbiAgICBkaXNwbGF5R3JpZDogKGdyaWQpID0+IHtcbiAgICAgICAgdmFyIGhlaWdodCA9IGdyaWQuaGVpZ2h0XG4gICAgICAgIHZhciB3aWR0aCA9IGdyaWQud2lkdGhcblxuICAgICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBoZWlnaHQ7IHJvdysrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCB3aWR0aDsgY29sKyspIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY2VsbC0ke3Jvd30tJHtjb2x9YClcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyaWQuZ3JpZFtyb3ddW2NvbF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzAwMDAwMFwiXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNhYWFhYWFcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3Igc2V0dGluZyB2aWV3IGZvciBwbG90ICR7cm93fSwke2NvbH06ICR7ZX1gKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjcmVhdGVHcmlkOiAod2lkdGgsaGVpZ2h0KSA9PiB7XG4gICAgICAgIGxldCB0YWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkJylcbiAgICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgaGVpZ2h0OyByb3crKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJylcbiAgICAgICAgICAgIGN1cnJlbnRSb3cuaWQgPSBgcm93LSR7cm93fWBcbiAgICAgICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHdpZHRoOyBjb2wrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpXG4gICAgICAgICAgICAgICAgY2VsbC5pZCA9IGBjZWxsLSR7cm93fS0ke2NvbH1gXG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc05hbWUgPSBgY2VsbGBcbiAgICAgICAgICAgICAgICBjdXJyZW50Um93LmFwcGVuZENoaWxkKGNlbGwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YWJsZS5hcHBlbmRDaGlsZChjdXJyZW50Um93KVxuICAgICAgICB9XG4gICAgfVxuXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ncmlkVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9