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



const height = 32
const width = 32

/* harmony default export */ __webpack_exports__["a"] = ({
    run: () => {
        grid = new __WEBPACK_IMPORTED_MODULE_0__grid__["a" /* default */](height, width).randomGrid(200)
        __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].createGrid(height, width)
        __WEBPACK_IMPORTED_MODULE_1__gridView__["a" /* default */].displayGrid(grid)

        for (var round = 100; round > 0; round--) {

        }
    }



});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Grid {

    constructor(height, width) {
        this.height = height
        this.width = width
        this.grid = this.buildGrid()

    }

    buildGrid() {
        var gridRows = {}
        for (var i = 1; i <= this.height; i++) {
            gridRows[i] = this.buildBaseRow(i)
        }
        return gridRows
    }

    buildBaseRow(row) {

        var baseRow = {}
        for (var j = 1; j <= this.width; j++) {
            baseRow[j] = {
                value: 0,
                upperLeft: [j - 1, row - 1],
                upper: [j, row - 1],
                upperRight: [j + 1, row - 1],
                right: [j + 1, row],
                lowerRight: [j + 1, row + 1],
                lower: [j, row + 1],
                lowerLeft: [j - 1, row + 1],
                left: [j - 1, row]
            }
        }

        return baseRow
    }

    randomGrid(marks) {
        // Grid size
        var height = this.height
        var width = this.width

        var liveCells = marks

        var filledGrid = new Grid(height, width)

        while (liveCells > 0) {
            var row = Math.floor((Math.random() * height)) + 1
            var col = Math.floor((Math.random() * width)) + 1
            if (filledGrid.grid[row][col].value === 0) {
                filledGrid.grid[row][col].value = 1
                liveCells--
            }
        }

        return filledGrid
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

        for (var x = 1; x <= width; x++) {
            for (var y = 1; y <= height; y++) {
                try {
                    var el = document.querySelectorAll(`#${x}-${y}`)
                    if (grid.grid[x][y].value) {
                        el.style.backgroundColor = "000000"
                    } else {
                        el.style.backgroundColor = "aaaaaa"
                    }
                } catch (e) {
                    console.log(`Error setting view for plot ${x},${y}: ${e}`)
                }
            }
        }
    },

    createGrid: (h,w) => {
        let table = document.querySelectorAll('#grid')
        for (var y = 1; y <=height; y++) {
            const row = document.createElement('tr')
            row.id = `row-${y}`
            table.appendChild(row)
            for (var x = 1; x <= width; x++) {
                const cell = document.createElement('td')
                cell.id = `${x}-${y}`
                cell.className = `cell`
            }
        }
    }

});


/***/ })
/******/ ]);