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

/* harmony default export */ __webpack_exports__["a"] = ({
    run: () => {
        let grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */]() //.randomGrid(200)
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

        tickInput.innerHTML = tick

        stepButton.addEventListener('click', () => {
            grid = grid.iterate()
            __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
            window.grid = grid
            tick++
            tickInput.innerHTML = tick
        })

        genButton.addEventListener('click', () => {
            const coveragePercent = document.querySelector('#coverage')
                .value
            const coveragePoints = Math.floor((coveragePercent * grid.width * grid.height) / 100)
            grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */]()
                .randomGrid(coveragePoints || 1)
            __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
            window.grid = grid
        })

        resetButton.addEventListener('click', () => {
            grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */]()
            __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
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
                    __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)
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
        // var gridX = {}
        // for (var i = 1; i <= this.width; i++) {
        //     gridX[i] = this.buildGridY(i)
        // }
        // return gridX
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

    // buildGridY(currentX) {
    //
    //     var gridY = {}
    //     for (var currentY = 1; currentY <= this.width; currentY++) {
    //         gridY[currentY] = {
    //             value: 0,
    //             neighbors: {
    //                 upperLeft: [(currentY - 1), (currentX - 1)],
    //                 upper: [(currentY - 1), currentX],
    //                 upperRight: [(currentY - 1), (currentX + 1)],
    //                 right: [currentY, (currentX + 1)],
    //                 lowerRight: [(currentY + 1), (currentX + 1)],
    //                 lower: [(currentY + 1), currentX],
    //                 lowerLeft: [(currentY - 1), (currentX - 1)],
    //                 left: [currentY, (currentX - 1)]
    //             }
    //         }
    //     }
    //
    //     return gridY
    // }

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
            // // preview new grid
            // for (var y = 1; y <= 10; y++) {
            //     var currentRow = []
            //     for (var x = 1; x <= 10; x++) {
            //         currentRow.push(updatedGrid.grid[y][x].value)
            //     }
            //     console.log(currentRow.join(' ') + '\n')
            // }
            // end preview
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



        // Object.keys(cell.neighbors)
        //     .forEach((n) => {
        //         const nv = cell.neighbors[n]
        //         if (nv[0] <= 0) {
        //             nv[0] = this.width
        //         }
        //
        //         if (nv[0] > this.width) {
        //             nv[0] = 1
        //         }
        //
        //         if (nv[1] <= 0) {
        //             nv[1] = this.height
        //         }
        //
        //         if (nv[1] > this.height) {
        //             nv[1] = 1
        //         }
        //
        //         if (this.grid[nv[0]][nv[1]].value) {
        //             count++
        //         }
        //     })

        return count
    }

    turnOn(x, y) {
        grid[x][y] = 1
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjFmYzdlNzYwODE3NzMxMmU3MjEiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9ydW5uZXIuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyaWQuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2pzL2dyaWRWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzdEQTs7QUFFQTs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVDs7OztBQUlBOzs7Ozs7OztBQ3RJQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLGlCQUFpQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixrQkFBa0I7QUFDM0M7QUFDQSw2QkFBNkIsbUJBQW1CO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLHdCQUF3QjtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXlCLG1CQUFtQjtBQUM1Qyw2QkFBNkIsa0JBQWtCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixTQUFTO0FBQ3ZDO0FBQ0Esa0NBQWtDLFNBQVM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjs7QUFFaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7Ozs7Ozs7O0FDbE1BOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx5QkFBeUIsY0FBYztBQUN2Qyw2QkFBNkIsYUFBYTtBQUMxQztBQUNBLDZEQUE2RCxJQUFJLEdBQUcsSUFBSTtBQUN4RTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsK0RBQStELElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtBQUNoRjtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSx5QkFBeUIsY0FBYztBQUN2QztBQUNBLG1DQUFtQyxJQUFJO0FBQ3ZDLDZCQUE2QixhQUFhO0FBQzFDO0FBQ0Esa0NBQWtDLElBQUksR0FBRyxJQUFJO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiJsci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGIxZmM3ZTc2MDgxNzczMTJlNzIxIiwiaW1wb3J0IHJ1bm5lciBmcm9tIFwiLi9ydW5uZXJcIlxuXG5ydW5uZXIucnVuKClcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBHcmlkIGZyb20gXCIuL2dyaWRcIlxuaW1wb3J0IGdyaWRWaWV3IGZyb20gXCIuL2dyaWRWaWV3XCJcblxubGV0IHRpY2sgPSAwXG5sZXQgYmF0Y2ggPSAwXG5sZXQgcmF0ZSA9IDEwMDBcbmxldCBnYW1lTG9vcFxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcnVuOiAoKSA9PiB7XG4gICAgICAgIGxldCBncmlkID0gbmV3IEdyaWQoKSAvLy5yYW5kb21HcmlkKDIwMClcbiAgICAgICAgLy8gZmxpcHBlclxuICAgICAgICAvLyBncmlkLmdyaWRbMl1bMl0gPSAxXG4gICAgICAgIC8vIGdyaWQuZ3JpZFszXVsyXSA9IDFcbiAgICAgICAgLy8gZ3JpZC5ncmlkWzRdWzJdID0gMVxuXG4gICAgICAgIC8vIGJveFxuICAgICAgICBncmlkLmdyaWRbMl1bMl0gPSAxXG4gICAgICAgIGdyaWQuZ3JpZFszXVsyXSA9IDFcbiAgICAgICAgZ3JpZC5ncmlkWzRdWzJdID0gMVxuICAgICAgICBncmlkLmdyaWRbMl1bM10gPSAxXG4gICAgICAgIGdyaWQuZ3JpZFszXVszXSA9IDFcbiAgICAgICAgZ3JpZC5ncmlkWzRdWzNdID0gMVxuICAgICAgICBncmlkLmdyaWRbMl1bNF0gPSAxXG4gICAgICAgIGdyaWQuZ3JpZFszXVs0XSA9IDFcbiAgICAgICAgZ3JpZC5ncmlkWzRdWzRdID0gMVxuXG5cbiAgICAgICAgd2luZG93LmdyaWQgPSBncmlkXG4gICAgICAgIGdyaWRWaWV3LmNyZWF0ZUdyaWQoZ3JpZC53aWR0aCwgZ3JpZC5oZWlnaHQpXG4gICAgICAgIGdyaWRWaWV3LmRpc3BsYXlHcmlkKGdyaWQpXG5cbiAgICAgICAgY29uc3QgdGlja0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RpY2snKVxuICAgICAgICBjb25zdCByb3VuZHNJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb3VuZHMnKVxuICAgICAgICBjb25zdCBjb3ZlcmFnZUlucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvdmVyYWdlJylcbiAgICAgICAgY29uc3Qgc3RlcEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdGVwJylcbiAgICAgICAgY29uc3QgZ2VuQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2dlbmVyYXRlJylcbiAgICAgICAgY29uc3QgcmVzZXRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVzZXQnKVxuICAgICAgICBjb25zdCBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdGFydCcpXG4gICAgICAgIGNvbnN0IHN0b3BCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc3RvcCcpXG5cbiAgICAgICAgdGlja0lucHV0LmlubmVySFRNTCA9IHRpY2tcblxuICAgICAgICBzdGVwQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgZ3JpZCA9IGdyaWQuaXRlcmF0ZSgpXG4gICAgICAgICAgICBncmlkVmlldy5kaXNwbGF5R3JpZChncmlkKVxuICAgICAgICAgICAgd2luZG93LmdyaWQgPSBncmlkXG4gICAgICAgICAgICB0aWNrKytcbiAgICAgICAgICAgIHRpY2tJbnB1dC5pbm5lckhUTUwgPSB0aWNrXG4gICAgICAgIH0pXG5cbiAgICAgICAgZ2VuQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY292ZXJhZ2VQZXJjZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvdmVyYWdlJylcbiAgICAgICAgICAgICAgICAudmFsdWVcbiAgICAgICAgICAgIGNvbnN0IGNvdmVyYWdlUG9pbnRzID0gTWF0aC5mbG9vcigoY292ZXJhZ2VQZXJjZW50ICogZ3JpZC53aWR0aCAqIGdyaWQuaGVpZ2h0KSAvIDEwMClcbiAgICAgICAgICAgIGdyaWQgPSBuZXcgR3JpZCgpXG4gICAgICAgICAgICAgICAgLnJhbmRvbUdyaWQoY292ZXJhZ2VQb2ludHMgfHwgMSlcbiAgICAgICAgICAgIGdyaWRWaWV3LmRpc3BsYXlHcmlkKGdyaWQpXG4gICAgICAgICAgICB3aW5kb3cuZ3JpZCA9IGdyaWRcbiAgICAgICAgfSlcblxuICAgICAgICByZXNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIGdyaWQgPSBuZXcgR3JpZCgpXG4gICAgICAgICAgICBncmlkVmlldy5kaXNwbGF5R3JpZChncmlkKVxuICAgICAgICAgICAgd2luZG93LmdyaWQgPSBncmlkXG4gICAgICAgIH0pXG5cbiAgICAgICAgc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByb3VuZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcm91bmRzJylcbiAgICAgICAgICAgICAgICAudmFsdWVcbiAgICAgICAgICAgIGxldCB0b2NrID0gMFxuICAgICAgICAgICAgc3RlcEJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKVxuICAgICAgICAgICAgcm91bmRzSW5wdXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICd0cnVlJylcbiAgICAgICAgICAgIGNvdmVyYWdlSW5wdXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICd0cnVlJylcbiAgICAgICAgICAgIGdlbkJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ3RydWUnKVxuICAgICAgICAgICAgcmVzZXRCdXR0b24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICd0cnVlJylcbiAgICAgICAgICAgIHN0YXJ0QnV0dG9uLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCAndHJ1ZScpXG5cbiAgICAgICAgICAgIGdhbWVMb29wID0gd2luZG93LnNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodG9jayA8IHJvdW5kcykge1xuICAgICAgICAgICAgICAgICAgICBncmlkID0gZ3JpZC5pdGVyYXRlKClcbiAgICAgICAgICAgICAgICAgICAgZ3JpZFZpZXcuZGlzcGxheUdyaWQoZ3JpZClcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmdyaWQgPSBncmlkXG4gICAgICAgICAgICAgICAgICAgIHRpY2srK1xuICAgICAgICAgICAgICAgICAgICB0b2NrKytcbiAgICAgICAgICAgICAgICAgICAgdGlja0lucHV0LmlubmVySFRNTCA9IHRpY2tcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbChnYW1lTG9vcClcbiAgICAgICAgICAgICAgICAgICAgc3RvcEJ1dHRvbi5jbGljaygpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgODAwKVxuICAgICAgICB9KVxuXG4gICAgICAgIHN0b3BCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBzdGVwQnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgICAgICAgICAgcm91bmRzSW5wdXQucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICBjb3ZlcmFnZUlucHV0LnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgICAgICAgICAgZ2VuQnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgICAgICAgICAgcmVzZXRCdXR0b24ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgICAgICAgICBzdGFydEJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJylcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKGdhbWVMb29wKVxuICAgICAgICB9KVxuXG4gICAgICAgIGNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNlbGwnKVxuICAgICAgICBsZXQgaXNEb3duID0gZmFsc2VcblxuICAgICAgICBjZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIChldikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpc0Rvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxvYyA9IGV2LnRhcmdldC5pZFxuICAgICAgICAgICAgICAgICAgICBsZXQgdVJvdyA9IHBhcnNlSW50KGxvYy5zcGxpdCgnLScpWzFdKVxuICAgICAgICAgICAgICAgICAgICBsZXQgdUNvbCA9IHBhcnNlSW50KGxvYy5zcGxpdCgnLScpWzJdKVxuICAgICAgICAgICAgICAgICAgICBncmlkLmdyaWRbdVJvd11bdUNvbF0gPSAhZ3JpZC5ncmlkW3VSb3ddW3VDb2xdXG4gICAgICAgICAgICAgICAgICAgIGdyaWRWaWV3LmRpc3BsYXlHcmlkKGdyaWQpXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5ncmlkID0gZ3JpZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICBpc0Rvd24gPSB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XG4gICAgICAgICAgICBpc0Rvd24gPSBmYWxzZVxuICAgICAgICB9KVxuXG5cbiAgICB9XG5cblxuXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ydW5uZXIuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgR3JpZCB7XG5cblxuXG4gICAgY29uc3RydWN0b3IoaGVpZ2h0LCB3aWR0aCkge1xuICAgICAgICBjb25zdCBERUZBVUxUX0hFSUdIVCA9IDIwXG4gICAgICAgIGNvbnN0IERFRkFVTFRfV0lEVEggPSAyMFxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodCB8fCBERUZBVUxUX0hFSUdIVFxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGggfHwgREVGQVVMVF9XSURUSFxuICAgICAgICB0aGlzLmdyaWQgPSB0aGlzLmJ1aWxkR3JpZCgpXG5cbiAgICB9XG5cbiAgICBidWlsZEdyaWQoKSB7XG4gICAgICAgIC8vIHZhciBncmlkWCA9IHt9XG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAxOyBpIDw9IHRoaXMud2lkdGg7IGkrKykge1xuICAgICAgICAvLyAgICAgZ3JpZFhbaV0gPSB0aGlzLmJ1aWxkR3JpZFkoaSlcbiAgICAgICAgLy8gfVxuICAgICAgICAvLyByZXR1cm4gZ3JpZFhcbiAgICAgICAgbGV0IGdyaWQgPSBbXVxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLndpZHRoOyByb3crKykge1xuICAgICAgICAgICAgbGV0IHBvaW50ID0gW11cbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuaGVpZ2h0OyBjb2wrKykge1xuICAgICAgICAgICAgICAgIHBvaW50LnB1c2goMClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdyaWQucHVzaChwb2ludClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBncmlkXG4gICAgfVxuXG4gICAgLy8gYnVpbGRHcmlkWShjdXJyZW50WCkge1xuICAgIC8vXG4gICAgLy8gICAgIHZhciBncmlkWSA9IHt9XG4gICAgLy8gICAgIGZvciAodmFyIGN1cnJlbnRZID0gMTsgY3VycmVudFkgPD0gdGhpcy53aWR0aDsgY3VycmVudFkrKykge1xuICAgIC8vICAgICAgICAgZ3JpZFlbY3VycmVudFldID0ge1xuICAgIC8vICAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgIC8vICAgICAgICAgICAgIG5laWdoYm9yczoge1xuICAgIC8vICAgICAgICAgICAgICAgICB1cHBlckxlZnQ6IFsoY3VycmVudFkgLSAxKSwgKGN1cnJlbnRYIC0gMSldLFxuICAgIC8vICAgICAgICAgICAgICAgICB1cHBlcjogWyhjdXJyZW50WSAtIDEpLCBjdXJyZW50WF0sXG4gICAgLy8gICAgICAgICAgICAgICAgIHVwcGVyUmlnaHQ6IFsoY3VycmVudFkgLSAxKSwgKGN1cnJlbnRYICsgMSldLFxuICAgIC8vICAgICAgICAgICAgICAgICByaWdodDogW2N1cnJlbnRZLCAoY3VycmVudFggKyAxKV0sXG4gICAgLy8gICAgICAgICAgICAgICAgIGxvd2VyUmlnaHQ6IFsoY3VycmVudFkgKyAxKSwgKGN1cnJlbnRYICsgMSldLFxuICAgIC8vICAgICAgICAgICAgICAgICBsb3dlcjogWyhjdXJyZW50WSArIDEpLCBjdXJyZW50WF0sXG4gICAgLy8gICAgICAgICAgICAgICAgIGxvd2VyTGVmdDogWyhjdXJyZW50WSAtIDEpLCAoY3VycmVudFggLSAxKV0sXG4gICAgLy8gICAgICAgICAgICAgICAgIGxlZnQ6IFtjdXJyZW50WSwgKGN1cnJlbnRYIC0gMSldXG4gICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgcmV0dXJuIGdyaWRZXG4gICAgLy8gfVxuXG4gICAgcmFuZG9tR3JpZChtYXJrcykge1xuICAgICAgICAvLyBHcmlkIHNpemVcbiAgICAgICAgdmFyIGhlaWdodCA9IHRoaXMuaGVpZ2h0XG4gICAgICAgIHZhciB3aWR0aCA9IHRoaXMud2lkdGhcblxuICAgICAgICB2YXIgbGl2ZUNlbGxzID0gbWFya3NcblxuICAgICAgICB2YXIgZmlsbGVkR3JpZCA9IG5ldyBHcmlkKGhlaWdodCwgd2lkdGgpXG5cbiAgICAgICAgd2hpbGUgKGxpdmVDZWxscyA+IDApIHtcbiAgICAgICAgICAgIHZhciByb3cgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogaGVpZ2h0KSlcbiAgICAgICAgICAgIHZhciBjb2wgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogd2lkdGgpKVxuICAgICAgICAgICAgaWYgKGZpbGxlZEdyaWQuZ3JpZFtyb3ddW2NvbF0gPT09IDApIHtcbiAgICAgICAgICAgICAgICBmaWxsZWRHcmlkLmdyaWRbcm93XVtjb2xdID0gMVxuICAgICAgICAgICAgICAgIGxpdmVDZWxscy0tXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsbGVkR3JpZFxuICAgIH1cblxuICAgIGl0ZXJhdGUoKSB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWRHcmlkID0gbmV3IEdyaWQodGhpcy5oZWlnaHQsIHRoaXMud2lkdGgpXG4gICAgICAgIGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IHRoaXMuaGVpZ2h0OyByb3crKykge1xuICAgICAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgdGhpcy53aWR0aDsgY29sKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbmVpZ2hib3JDb3VudCA9IHRoaXMuZ2V0TmVpZ2hib3JDb3VudChyb3csIGNvbClcbiAgICAgICAgICAgICAgICBpZiAobmVpZ2hib3JDb3VudCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkR3JpZC5ncmlkW3Jvd11bY29sXSA9IDFcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChuZWlnaGJvckNvdW50ID09PSAyKSAmJiAodGhpcy5ncmlkW3Jvd11bY29sXSA9PT0gMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZEdyaWQuZ3JpZFtyb3ddW2NvbF0gPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gLy8gcHJldmlldyBuZXcgZ3JpZFxuICAgICAgICAgICAgLy8gZm9yICh2YXIgeSA9IDE7IHkgPD0gMTA7IHkrKykge1xuICAgICAgICAgICAgLy8gICAgIHZhciBjdXJyZW50Um93ID0gW11cbiAgICAgICAgICAgIC8vICAgICBmb3IgKHZhciB4ID0gMTsgeCA8PSAxMDsgeCsrKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgIGN1cnJlbnRSb3cucHVzaCh1cGRhdGVkR3JpZC5ncmlkW3ldW3hdLnZhbHVlKVxuICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhjdXJyZW50Um93LmpvaW4oJyAnKSArICdcXG4nKVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gZW5kIHByZXZpZXdcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1cGRhdGVkR3JpZFxuICAgIH1cblxuICAgIGdldE5laWdoYm9yQ291bnQocm93LCBjb2wpIHtcbiAgICAgICAgdmFyIGNvdW50ID0gMFxuICAgICAgICB2YXIgblJvdywgbkNvbFxuXG4gICAgICAgIC8vIFVwcGVyIGxlZnRcbiAgICAgICAgblJvdyA9IChyb3cgLSAxKSA+IC0xID8gcm93IC0gMSA6IHRoaXMuaGVpZ2h0IC0gMVxuICAgICAgICBuQ29sID0gKGNvbCAtIDEpID4gLTEgPyBjb2wgLSAxIDogdGhpcy53aWR0aCAtIDFcbiAgICAgICAgaWYodGhpcy5ncmlkW25Sb3ddW25Db2xdKSB7XG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcHBlclxuICAgICAgICBuUm93ID0gKHJvdyAtIDEpID4gLTEgPyByb3cgLSAxIDogdGhpcy5oZWlnaHQgLSAxXG4gICAgICAgIG5Db2wgPSBjb2xcbiAgICAgICAgaWYodGhpcy5ncmlkW25Sb3ddW25Db2xdKSB7XG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcHBlciByaWdodFxuICAgICAgICBuUm93ID0gKHJvdyAtIDEpID4gLTEgPyByb3cgLSAxIDogdGhpcy5oZWlnaHQgLSAxXG4gICAgICAgIG5Db2wgPSAoY29sICsgMSkgPCB0aGlzLndpZHRoID8gKGNvbCArIDEpIDogMFxuICAgICAgICBpZih0aGlzLmdyaWRbblJvd11bbkNvbF0pIHtcbiAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxlZnRcbiAgICAgICAgblJvdyA9IHJvd1xuICAgICAgICBuQ29sID0gKGNvbCAtIDEpID4gLTEgPyBjb2wgLSAxIDogdGhpcy53aWR0aCAtIDFcbiAgICAgICAgaWYodGhpcy5ncmlkW25Sb3ddW25Db2xdKSB7XG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgIH1cblxuICAgICAgICAvLyByaWdodFxuICAgICAgICBuUm93ID0gcm93XG4gICAgICAgIG5Db2wgPSAoY29sICsgMSkgPCB0aGlzLndpZHRoID8gKGNvbCArIDEpIDogMFxuICAgICAgICBpZih0aGlzLmdyaWRbblJvd11bbkNvbF0pIHtcbiAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvd2VyIGxlZnRcbiAgICAgICAgblJvdyA9IChyb3cgKyAxKSA8IHRoaXMuaGVpZ2h0ID8gKHJvdyArIDEpIDogMFxuICAgICAgICBuQ29sID0gKGNvbCAtIDEpID4gLTEgPyBjb2wgLSAxIDogdGhpcy53aWR0aCAtIDFcbiAgICAgICAgaWYodGhpcy5ncmlkW25Sb3ddW25Db2xdKSB7XG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb3dlclxuICAgICAgICBuUm93ID0gKHJvdyArIDEpIDwgdGhpcy5oZWlnaHQgPyAocm93ICsgMSkgOiAwXG4gICAgICAgIG5Db2wgPSBjb2xcbiAgICAgICAgaWYodGhpcy5ncmlkW25Sb3ddW25Db2xdKSB7XG4gICAgICAgICAgICBjb3VudCsrXG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb3dlciByaWdodFxuICAgICAgICBuUm93ID0gKHJvdyArIDEpIDwgdGhpcy5oZWlnaHQgPyAocm93ICsgMSkgOiAwXG4gICAgICAgIG5Db2wgPSAoY29sICsgMSkgPCB0aGlzLndpZHRoID8gKGNvbCArIDEpIDogMFxuICAgICAgICBpZih0aGlzLmdyaWRbblJvd11bbkNvbF0pIHtcbiAgICAgICAgICAgIGNvdW50KytcbiAgICAgICAgfVxuXG5cblxuICAgICAgICAvLyBPYmplY3Qua2V5cyhjZWxsLm5laWdoYm9ycylcbiAgICAgICAgLy8gICAgIC5mb3JFYWNoKChuKSA9PiB7XG4gICAgICAgIC8vICAgICAgICAgY29uc3QgbnYgPSBjZWxsLm5laWdoYm9yc1tuXVxuICAgICAgICAvLyAgICAgICAgIGlmIChudlswXSA8PSAwKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIG52WzBdID0gdGhpcy53aWR0aFxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICBpZiAobnZbMF0gPiB0aGlzLndpZHRoKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIG52WzBdID0gMVxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICBpZiAobnZbMV0gPD0gMCkge1xuICAgICAgICAvLyAgICAgICAgICAgICBudlsxXSA9IHRoaXMuaGVpZ2h0XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgIGlmIChudlsxXSA+IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIG52WzFdID0gMVxuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICBpZiAodGhpcy5ncmlkW252WzBdXVtudlsxXV0udmFsdWUpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgY291bnQrK1xuICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgLy8gICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGNvdW50XG4gICAgfVxuXG4gICAgdHVybk9uKHgsIHkpIHtcbiAgICAgICAgZ3JpZFt4XVt5XSA9IDFcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3JpZFxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvZ3JpZC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCB7XG5cbiAgICBkaXNwbGF5R3JpZDogKGdyaWQpID0+IHtcbiAgICAgICAgdmFyIGhlaWdodCA9IGdyaWQuaGVpZ2h0XG4gICAgICAgIHZhciB3aWR0aCA9IGdyaWQud2lkdGhcblxuICAgICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBoZWlnaHQ7IHJvdysrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCB3aWR0aDsgY29sKyspIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY2VsbC0ke3Jvd30tJHtjb2x9YClcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdyaWQuZ3JpZFtyb3ddW2NvbF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzAwMDAwMFwiXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNhYWFhYWFcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3Igc2V0dGluZyB2aWV3IGZvciBwbG90ICR7cm93fSwke2NvbH06ICR7ZX1gKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjcmVhdGVHcmlkOiAod2lkdGgsaGVpZ2h0KSA9PiB7XG4gICAgICAgIGxldCB0YWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNncmlkJylcbiAgICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgaGVpZ2h0OyByb3crKykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyJylcbiAgICAgICAgICAgIGN1cnJlbnRSb3cuaWQgPSBgcm93LSR7cm93fWBcbiAgICAgICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IHdpZHRoOyBjb2wrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZCcpXG4gICAgICAgICAgICAgICAgY2VsbC5pZCA9IGBjZWxsLSR7cm93fS0ke2NvbH1gXG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc05hbWUgPSBgY2VsbGBcbiAgICAgICAgICAgICAgICBjdXJyZW50Um93LmFwcGVuZENoaWxkKGNlbGwpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YWJsZS5hcHBlbmRDaGlsZChjdXJyZW50Um93KVxuICAgICAgICB9XG4gICAgfVxuXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9ncmlkVmlldy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9