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

/* harmony default export */ __webpack_exports__["a"] = ({
    run: () => {
        let grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */](20,20)

        window.grid = grid
        __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].createGrid(grid.width, grid.height)
        __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)

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
            __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
            window.grid = grid
            tick++
            tickInput.innerHTML = tick
            isStarted = true
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
            isStarted = false
        })

        resetButton.addEventListener('click', () => {
            grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */]()
            __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
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
                    __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
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
                if(!isStarted) {
                    grid.grid[uRow][uCol] = !grid.grid[uRow][uCol]
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
                    grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */]()
                    grid.grid = data
                    __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTE5YmI3OGExNDc5MjIzZDljYzciLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ydW5uZXIuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyaWQuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyaWRWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzdEQTs7QUFFQTs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxrSEFBa0gsUUFBUTtBQUMxSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOzs7O0FBSUE7Ozs7Ozs7O0FDOU1BOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXlCLGtCQUFrQjtBQUMzQztBQUNBLDZCQUE2QixtQkFBbUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF5QixtQkFBbUI7QUFDNUMsNkJBQTZCLGtCQUFrQjtBQUMvQztBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUM1SEE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHlCQUF5QixjQUFjO0FBQ3ZDLDZCQUE2QixhQUFhO0FBQzFDO0FBQ0EsNkRBQTZELElBQUksR0FBRyxJQUFJO0FBQ3hFO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQiwrREFBK0QsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLHlCQUF5QixjQUFjO0FBQ3ZDO0FBQ0EsbUNBQW1DLElBQUk7QUFDdkMsNkJBQTZCLGFBQWE7QUFDMUM7QUFDQSxrQ0FBa0MsSUFBSSxHQUFHLElBQUk7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBIiwiZmlsZSI6ImxyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTE5YmI3OGExNDc5MjIzZDljYzciLCJpbXBvcnQgcnVubmVyIGZyb20gXCIuL3J1bm5lclwiXG5cbnJ1bm5lci5ydW4oKVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IEdyaWQgZnJvbSBcIi4vZ3JpZFwiXG5pbXBvcnQgZ3JpZFZpZXcgZnJvbSBcIi4vZ3JpZFZpZXdcIlxuXG5sZXQgdGljayA9IDBcbmxldCBiYXRjaCA9IDBcbmxldCByYXRlID0gMTAwMFxubGV0IGdhbWVMb29wXG5sZXQgYWN0aXZlQ291bnQgPSAwXG5sZXQgaXNTdGFydGVkID0gZmFsc2VcbmxldCBpc1J1bm5pbmcgPSBmYWxzZVxubGV0IGlzTG9hZGVkID0gZmFsc2VcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHJ1bjogKCkgPT4ge1xuICAgICAgICBsZXQgZ3JpZCA9IG5ldyBHcmlkKDIwLDIwKVxuXG4gICAgICAgIHdpbmRvdy5ncmlkID0gZ3JpZFxuICAgICAgICBncmlkVmlldy5jcmVhdGVHcmlkKGdyaWQud2lkdGgsIGdyaWQuaGVpZ2h0KVxuICAgICAgICBncmlkVmlldy5kaXNwbGF5R3JpZChncmlkKVxuXG4gICAgICAgIGNvbnN0IHRpY2tJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0aWNrJylcbiAgICAgICAgY29uc3Qgcm91bmRzSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm91bmRzJylcbiAgICAgICAgY29uc3QgY292ZXJhZ2VJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb3ZlcmFnZScpXG4gICAgICAgIGNvbnN0IHN0ZXBCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RlcCcpXG4gICAgICAgIGNvbnN0IGdlbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnZW5lcmF0ZScpXG4gICAgICAgIGNvbnN0IHJlc2V0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Jlc2V0JylcbiAgICAgICAgY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RhcnQnKVxuICAgICAgICBjb25zdCBzdG9wQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3N0b3AnKVxuICAgICAgICBjb25zdCBsb2FkQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvYWQnKVxuXG4gICAgICAgIHRpY2tJbnB1dC5pbm5lckhUTUwgPSB0aWNrXG5cbiAgICAgICAgc3RlcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGdyaWQgPSBncmlkLml0ZXJhdGUoKVxuICAgICAgICAgICAgZ3JpZFZpZXcuZGlzcGxheUdyaWQoZ3JpZClcbiAgICAgICAgICAgIHdpbmRvdy5ncmlkID0gZ3JpZFxuICAgICAgICAgICAgdGljaysrXG4gICAgICAgICAgICB0aWNrSW5wdXQuaW5uZXJIVE1MID0gdGlja1xuICAgICAgICAgICAgaXNTdGFydGVkID0gdHJ1ZVxuICAgICAgICB9KVxuXG4gICAgICAgIGdlbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvdmVyYWdlUGVyY2VudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb3ZlcmFnZScpXG4gICAgICAgICAgICAgICAgLnZhbHVlXG4gICAgICAgICAgICBjb25zdCBjb3ZlcmFnZVBvaW50cyA9IE1hdGguZmxvb3IoKGNvdmVyYWdlUGVyY2VudCAqIGdyaWQud2lkdGggKiBncmlkLmhlaWdodCkgLyAxMDApXG4gICAgICAgICAgICBncmlkID0gbmV3IEdyaWQoKVxuICAgICAgICAgICAgICAgIC5yYW5kb21HcmlkKGNvdmVyYWdlUG9pbnRzIHx8IDEpXG4gICAgICAgICAgICBncmlkVmlldy5kaXNwbGF5R3JpZChncmlkKVxuICAgICAgICAgICAgd2luZG93LmdyaWQgPSBncmlkXG4gICAgICAgICAgICB0aWNrID0gMFxuICAgICAgICAgICAgdGlja0lucHV0LmlubmVySFRNTCA9IHRpY2tcbiAgICAgICAgICAgIGlzU3RhcnRlZCA9IGZhbHNlXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBncmlkID0gbmV3IEdyaWQoKVxuICAgICAgICAgICAgZ3JpZFZpZXcuZGlzcGxheUdyaWQoZ3JpZClcbiAgICAgICAgICAgIHdpbmRvdy5ncmlkID0gZ3JpZFxuICAgICAgICAgICAgdGljayA9IDBcbiAgICAgICAgICAgIHRpY2tJbnB1dC5pbm5lckhUTUwgPSB0aWNrXG4gICAgICAgICAgICBpc1N0YXJ0ZWQgPSBmYWxzZVxuICAgICAgICB9KVxuXG4gICAgICAgIHN0YXJ0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgaXNTdGFydGVkID0gdHJ1ZVxuICAgICAgICAgICAgaXNSdW5uaW5nID0gdHJ1ZVxuICAgICAgICAgICAgY29uc3Qgcm91bmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvdW5kcycpXG4gICAgICAgICAgICAgICAgLnZhbHVlXG4gICAgICAgICAgICBsZXQgdG9jayA9IDBcbiAgICAgICAgICAgIHN0ZXBCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICd0cnVlJylcbiAgICAgICAgICAgIHN0b3BCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICByb3VuZHNJbnB1dC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKVxuICAgICAgICAgICAgY292ZXJhZ2VJbnB1dC5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKVxuICAgICAgICAgICAgZ2VuQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAndHJ1ZScpXG4gICAgICAgICAgICByZXNldEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKVxuICAgICAgICAgICAgc3RhcnRCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICd0cnVlJylcblxuICAgICAgICAgICAgZ2FtZUxvb3AgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0b2NrIDwgcm91bmRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyaWQgPSBncmlkLml0ZXJhdGUoKVxuICAgICAgICAgICAgICAgICAgICBncmlkVmlldy5kaXNwbGF5R3JpZChncmlkKVxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZ3JpZCA9IGdyaWRcbiAgICAgICAgICAgICAgICAgICAgdGljaysrXG4gICAgICAgICAgICAgICAgICAgIHRvY2srK1xuICAgICAgICAgICAgICAgICAgICB0aWNrSW5wdXQuaW5uZXJIVE1MID0gdGlja1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKGdhbWVMb29wKVxuICAgICAgICAgICAgICAgICAgICBzdG9wQnV0dG9uLmNsaWNrKClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCA4MDApXG4gICAgICAgIH0pXG5cbiAgICAgICAgc3RvcEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGlzUnVubmluZyA9IGZhbHNlXG4gICAgICAgICAgICBzdG9wQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgc3RlcEJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIHJvdW5kc0lucHV0LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgICAgICAgICAgY292ZXJhZ2VJbnB1dC5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIGdlbkJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIHJlc2V0QnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgICAgICAgICAgc3RhcnRCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbChnYW1lTG9vcClcbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jZWxsJylcbiAgICAgICAgbGV0IGlzRG93biA9IGZhbHNlXG5cbiAgICAgICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEb3duICYmICFpc1N0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvYyA9IGV2LnRhcmdldC5pZFxuICAgICAgICAgICAgICAgICAgICBsZXQgdVJvdyA9IHBhcnNlSW50KGxvYy5zcGxpdCgnLScpWzFdKVxuICAgICAgICAgICAgICAgICAgICBsZXQgdUNvbCA9IHBhcnNlSW50KGxvYy5zcGxpdCgnLScpWzJdKVxuICAgICAgICAgICAgICAgICAgICBncmlkLmdyaWRbdVJvd11bdUNvbF0gPSAhZ3JpZC5ncmlkW3VSb3ddW3VDb2xdXG4gICAgICAgICAgICAgICAgICAgIGdyaWRWaWV3LmRpc3BsYXlHcmlkKGdyaWQpXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5ncmlkID0gZ3JpZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICBpc0Rvd24gPSB0cnVlXG4gICAgICAgICAgICAgICAgbGV0IGxvYyA9IGV2LnRhcmdldC5pZFxuICAgICAgICAgICAgICAgIGxldCB1Um93ID0gcGFyc2VJbnQobG9jLnNwbGl0KCctJylbMV0pXG4gICAgICAgICAgICAgICAgbGV0IHVDb2wgPSBwYXJzZUludChsb2Muc3BsaXQoJy0nKVsyXSlcbiAgICAgICAgICAgICAgICBpZighaXNTdGFydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGdyaWQuZ3JpZFt1Um93XVt1Q29sXSA9ICFncmlkLmdyaWRbdVJvd11bdUNvbF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZ3JpZFZpZXcuZGlzcGxheUdyaWQoZ3JpZClcbiAgICAgICAgICAgICAgICB3aW5kb3cuZ3JpZCA9IGdyaWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpc0Rvd24gPSBmYWxzZVxuICAgICAgICAgICAgICAgIGxldCBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jZWxsJylcblxuICAgICAgICAgICAgICAgIGFjdGl2ZUNvdW50ID0gMFxuXG4gICAgICAgICAgICAgICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZihjZWxsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9PT0gJ3JnYigwLCAwLCAwKScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNvdW50KytcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgaWYgKChhY3RpdmVDb3VudCA9PT0gMCkgfHwgaXNSdW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICBzdGVwQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb3VuZHMnKS52YWx1ZSAhPSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3RlcEJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LDEwMClcbiAgICAgICAgfSlcblxuICAgICAgICByb3VuZHNJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldikgPT4ge1xuICAgICAgICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JvdW5kcycpLnZhbHVlICE9ICcnICYmIGFjdGl2ZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgc3RhcnRCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0YXJ0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvdmVyYWdlSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb3ZlcmFnZScpLnZhbHVlICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgZ2VuQnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgICAgICAgICAgICAgIHN0ZXBCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGdlbkJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICAgICAgICAgICAgICBzdGVwQnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIGxvYWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGdyaWRSZWYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZFJlZicpLnZhbHVlXG4gICAgICAgICAgICBpZigvXlxcZFxcZFxcZFxcZFxcZFxcZFxcZFxcZCQvLnRlc3QoZ3JpZFJlZikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsb2FkR3JpZFVSTCA9IGBodHRwczovL3VzLWNlbnRyYWwxLWxpZmVyZWNvcmRlZC1jNzMwZi5jbG91ZGZ1bmN0aW9ucy5uZXQvbG9hZEdyaWQ/Z3JpZFJlZj0ke2dyaWRSZWZ9YFxuICAgICAgICAgICAgICAgIHdpbmRvdy5qUXVlcnkuZ2V0KGxvYWRHcmlkVVJMLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBncmlkID0gbmV3IEdyaWQoKVxuICAgICAgICAgICAgICAgICAgICBncmlkLmdyaWQgPSBkYXRhXG4gICAgICAgICAgICAgICAgICAgIGdyaWRWaWV3LmRpc3BsYXlHcmlkKGdyaWQpXG4gICAgICAgICAgICAgICAgICAgIGlzTG9hZGVkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICByZXNldEJ1dHRvbi5jbGljaygpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2FkRXJyb3InKVxuICAgICAgICAgICAgICAgIGVycm9yRWwudGV4dENvbnRlbnQgPSBcIlRoZSBncmlkIHJlZmVyZW5jZSBtdXN0IGJlIDggbnVtZXJpYyBjaGFyYWN0ZXJzXCJcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiBlcnJvckVsLnRleHRDb250ZW50ID0gJycsIDMwMDApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgd2luZG93LnRlc3RTYXZlID0gZnVuY3Rpb24ocmVmKSB7XG4gICAgICAgICAgICBjb25zdCBzYXZlVVJMID0gYGh0dHBzOi8vdXMtY2VudHJhbDEtbGlmZXJlY29yZGVkLWM3MzBmLmNsb3VkZnVuY3Rpb25zLm5ldC9zYXZlR3JpZGBcbiAgICAgICAgICAgIGpRdWVyeS5nZXQoc2F2ZVVSTCwge1xuICAgICAgICAgICAgICAgIGdyaWRSZWY6IHJlZixcbiAgICAgICAgICAgICAgICBncmlkVmFsdWU6IGdyaWQuZ3JpZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvcnVubmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIEdyaWQge1xuXG4gICAgY29uc3RydWN0b3IoaGVpZ2h0LCB3aWR0aCkge1xuICAgICAgICBjb25zdCBERUZBVUxUX0hFSUdIVCA9IDIwXG4gICAgICAgIGNvbnN0IERFRkFVTFRfV0lEVEggPSAyMFxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCBERUZBVUxUX0hFSUdIVFxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGggfHwgREVGQVVMVF9XSURUSFxuICAgICAgICB0aGlzLmdyaWQgPSB0aGlzLmJ1aWxkR3JpZCgpXG5cbiAgICB9XG5cbiAgICBidWlsZEdyaWQoKSB7XG4gICAgICAgIGxldCBncmlkID0gW11cbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy53aWR0aDsgcm93KyspIHtcbiAgICAgICAgICAgIGxldCBwb2ludCA9IFtdXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLmhlaWdodDsgY29sKyspIHtcbiAgICAgICAgICAgICAgICBwb2ludC5wdXNoKDApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncmlkLnB1c2gocG9pbnQpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ3JpZFxuICAgIH1cblxuICAgIHJhbmRvbUdyaWQobWFya3MpIHtcbiAgICAgICAgLy8gR3JpZCBzaXplXG4gICAgICAgIHZhciBoZWlnaHQgPSB0aGlzLmhlaWdodFxuICAgICAgICB2YXIgd2lkdGggPSB0aGlzLndpZHRoXG5cbiAgICAgICAgdmFyIGxpdmVDZWxscyA9IG1hcmtzXG5cbiAgICAgICAgdmFyIGZpbGxlZEdyaWQgPSBuZXcgR3JpZChoZWlnaHQsIHdpZHRoKVxuXG4gICAgICAgIHdoaWxlIChsaXZlQ2VsbHMgPiAwKSB7XG4gICAgICAgICAgICB2YXIgcm93ID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIGhlaWdodCkpXG4gICAgICAgICAgICB2YXIgY29sID0gTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIHdpZHRoKSlcbiAgICAgICAgICAgIGlmIChmaWxsZWRHcmlkLmdyaWRbcm93XVtjb2xdID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZmlsbGVkR3JpZC5ncmlkW3Jvd11bY29sXSA9IDFcbiAgICAgICAgICAgICAgICBsaXZlQ2VsbHMtLVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGxlZEdyaWRcbiAgICB9XG5cbiAgICBpdGVyYXRlKCkge1xuICAgICAgICBjb25zdCB1cGRhdGVkR3JpZCA9IG5ldyBHcmlkKHRoaXMuaGVpZ2h0LCB0aGlzLndpZHRoKVxuICAgICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCB0aGlzLmhlaWdodDsgcm93KyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHRoaXMud2lkdGg7IGNvbCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5laWdoYm9yQ291bnQgPSB0aGlzLmdldE5laWdoYm9yQ291bnQocm93LCBjb2wpXG4gICAgICAgICAgICAgICAgaWYgKG5laWdoYm9yQ291bnQgPT09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZEdyaWQuZ3JpZFtyb3ddW2NvbF0gPSAxXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgobmVpZ2hib3JDb3VudCA9PT0gMikgJiYgKHRoaXMuZ3JpZFtyb3ddW2NvbF0gPT09IDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWRHcmlkLmdyaWRbcm93XVtjb2xdID0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cGRhdGVkR3JpZFxuICAgIH1cblxuICAgIGdldE5laWdoYm9yQ291bnQocm93LCBjb2wpIHtcbiAgICAgICAgdmFyIGNvdW50ID0gMFxuICAgICAgICB2YXIgblJvdywgbkNvbFxuXG4gICAgICAgIC8vIFVwcGVyIGxlZnRcbiAgICAgICAgblJvdyA9IChyb3cgLSAxKSA+IC0xID8gcm93IC0gMSA6IHRoaXMuaGVpZ2h0IC0gMVxuICAgICAgICBuQ29sID0gKGNvbCAtIDEpID4gLTEgPyBjb2wgLSAxIDogdGhpcy53aWR0aCAtIDFcbiAgICAgICAgaWYodGhpcy5ncmlkW25Sb3ddW25Db2xdKSB7XG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcHBlclxuICAgICAgICBuUm93ID0gKHJvdyAtIDEpID4gLTEgPyByb3cgLSAxIDogdGhpcy5oZWlnaHQgLSAxXG4gICAgICAgIG5Db2wgPSBjb2xcbiAgICAgICAgaWYodGhpcy5ncmlkW25Sb3ddW25Db2xdKSB7XG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcHBlciByaWdodFxuICAgICAgICBuUm93ID0gKHJvdyAtIDEpID4gLTEgPyByb3cgLSAxIDogdGhpcy5oZWlnaHQgLSAxXG4gICAgICAgIG5Db2wgPSAoY29sICsgMSkgPCB0aGlzLndpZHRoID8gKGNvbCArIDEpIDogMFxuICAgICAgICBpZih0aGlzLmdyaWRbblJvd11bbkNvbF0pIHtcbiAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxlZnRcbiAgICAgICAgblJvdyA9IHJvd1xuICAgICAgICBuQ29sID0gKGNvbCAtIDEpID4gLTEgPyBjb2wgLSAxIDogdGhpcy53aWR0aCAtIDFcbiAgICAgICAgaWYodGhpcy5ncmlkW25Sb3ddW25Db2xdKSB7XG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgIH1cblxuICAgICAgICAvLyByaWdodFxuICAgICAgICBuUm93ID0gcm93XG4gICAgICAgIG5Db2wgPSAoY29sICsgMSkgPCB0aGlzLndpZHRoID8gKGNvbCArIDEpIDogMFxuICAgICAgICBpZih0aGlzLmdyaWRbblJvd11bbkNvbF0pIHtcbiAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvd2VyIGxlZnRcbiAgICAgICAgblJvdyA9IChyb3cgKyAxKSA8IHRoaXMuaGVpZ2h0ID8gKHJvdyArIDEpIDogMFxuICAgICAgICBuQ29sID0gKGNvbCAtIDEpID4gLTEgPyBjb2wgLSAxIDogdGhpcy53aWR0aCAtIDFcbiAgICAgICAgaWYodGhpcy5ncmlkW25Sb3ddW25Db2xdKSB7XG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb3dlclxuICAgICAgICBuUm93ID0gKHJvdyArIDEpIDwgdGhpcy5oZWlnaHQgPyAocm93ICsgMSkgOiAwXG4gICAgICAgIG5Db2wgPSBjb2xcbiAgICAgICAgaWYodGhpcy5ncmlkW25Sb3ddW25Db2xdKSB7XG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb3dlciByaWdodFxuICAgICAgICBuUm93ID0gKHJvdyArIDEpIDwgdGhpcy5oZWlnaHQgPyAocm93ICsgMSkgOiAwXG4gICAgICAgIG5Db2wgPSAoY29sICsgMSkgPCB0aGlzLndpZHRoID8gKGNvbCArIDEpIDogMFxuICAgICAgICBpZih0aGlzLmdyaWRbblJvd11bbkNvbF0pIHtcbiAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnRcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyaWRcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2dyaWQuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQge1xuXG4gICAgZGlzcGxheUdyaWQ6IChncmlkKSA9PiB7XG4gICAgICAgIHZhciBoZWlnaHQgPSBncmlkLmhlaWdodFxuICAgICAgICB2YXIgd2lkdGggPSBncmlkLndpZHRoXG5cbiAgICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgaGVpZ2h0OyByb3crKykge1xuICAgICAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgd2lkdGg7IGNvbCsrKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2NlbGwtJHtyb3d9LSR7Y29sfWApXG4gICAgICAgICAgICAgICAgICAgIGlmIChncmlkLmdyaWRbcm93XVtjb2xdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiMwMDAwMDBcIlxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjYWFhYWFhXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHNldHRpbmcgdmlldyBmb3IgcGxvdCAke3Jvd30sJHtjb2x9OiAke2V9YClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgY3JlYXRlR3JpZDogKHdpZHRoLGhlaWdodCkgPT4ge1xuICAgICAgICBsZXQgdGFibGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZ3JpZCcpXG4gICAgICAgIGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IGhlaWdodDsgcm93KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cicpXG4gICAgICAgICAgICBjdXJyZW50Um93LmlkID0gYHJvdy0ke3Jvd31gXG4gICAgICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCB3aWR0aDsgY29sKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGQnKVxuICAgICAgICAgICAgICAgIGNlbGwuaWQgPSBgY2VsbC0ke3Jvd30tJHtjb2x9YFxuICAgICAgICAgICAgICAgIGNlbGwuY2xhc3NOYW1lID0gYGNlbGxgXG4gICAgICAgICAgICAgICAgY3VycmVudFJvdy5hcHBlbmRDaGlsZChjZWxsKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFibGUuYXBwZW5kQ2hpbGQoY3VycmVudFJvdylcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvZ3JpZFZpZXcuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==