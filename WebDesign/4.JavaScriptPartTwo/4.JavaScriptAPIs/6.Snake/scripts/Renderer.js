define(function(require) {
    'use strict';

    var utils = require('utils')
    var Point = require('Point')

    var ZOOM = 20
    var PADDING = 3

    function Renderer(canvas, rows, cols) {
        // Reversed
        canvas.width  = cols * ZOOM - PADDING
        canvas.height = rows * ZOOM - PADDING

        this.context = canvas.getContext('2d')

        this.rows = rows
        this.cols = cols

        this.scene = utils.makeBoolMatrix(this.rows, this.cols)
    }

    Renderer.prototype =
        { add: function(obj) {
            var first = Point(
                Math.max(obj.position.row, 0),
                Math.max(obj.position.col, 0)
            )

            var last = Point(
                Math.min(obj.position.row + obj.rows, this.rows),
                Math.min(obj.position.col + obj.cols, this.cols)
            )

            var row, col

            for (row = first.row; row < last.row; row++) {
                for (col = first.col; col < last.col; col++) {
                    if (obj.image[row - first.row][col - first.col])
                        this.scene[row][col] = true
                }
            }
        }

        , renderAll: (function() {
            var _render = (function() {
                function _draw(row, col) {
                    this.context.fillStyle = 'lightGray'
                    this.context.fillRect(col * ZOOM, row * ZOOM, ZOOM - PADDING, ZOOM - PADDING)
                }

                return function() {
                    var row, col

                    this.context.clearRect(0, 0, this.cols * ZOOM, this.rows * ZOOM)

                    for (row = 0; row < this.scene.length; row++) {
                        for (col = 0; col < this.scene[row].length; col++) {
                            if (this.scene[row][col])
                                _draw.call(this, row, col)
                        }
                    }
                }
            }())

            function _clear() {
                var row, col

                for (row = 0; row < this.scene.length; row++)
                    for (col = 0; col < this.scene[row].length; col++)
                        this.scene[row][col] = false
            }

            return function() {
                _render.call(this)
                _clear.call(this)
            }
        }())
    }

    return Renderer
})