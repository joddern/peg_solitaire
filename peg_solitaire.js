"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardElement = void 0;
var BoardElement;
(function (BoardElement) {
    BoardElement[BoardElement["Empty"] = 0] = "Empty";
    BoardElement[BoardElement["Ball"] = 1] = "Ball";
    BoardElement[BoardElement["Restricted"] = 2] = "Restricted";
})(BoardElement || (exports.BoardElement = BoardElement = {}));
var STANDARD_BOARD_WIDTH = 7;
var STANDARD_BOARD_HEIGHT = 7;
var STANDARD_BOARD_SETUP = [
    [BoardElement.Restricted, BoardElement.Restricted, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Restricted, BoardElement.Restricted],
    [BoardElement.Restricted, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Restricted],
    [BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball],
    [BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball],
    [BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball],
    [BoardElement.Restricted, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Restricted],
    [BoardElement.Restricted, BoardElement.Restricted, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Restricted, BoardElement.Restricted],
];
var PegSolitaire = /** @class */ (function () {
    function PegSolitaire(boardWidth, boardHeight, board) {
        if (boardWidth === void 0) { boardWidth = STANDARD_BOARD_WIDTH; }
        if (boardHeight === void 0) { boardHeight = STANDARD_BOARD_HEIGHT; }
        if (board === void 0) { board = STANDARD_BOARD_SETUP; }
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.board = board;
        this.eligibleMoves = this.findEligibleMovesForSetup();
        this.nonRestrictedCoordinates = this.findNonRestrictedCoords();
    }
    PegSolitaire.prototype.getBoard = function () {
        return this.board;
    };
    PegSolitaire.prototype.removeBall = function (_a) {
        var x = _a.x, y = _a.y;
        if (x < 0 || x >= this.boardWidth ||
            y < 0 || y >= this.boardHeight)
            throw new Error("Tried removeBall outside of board: x:".concat(x, ", y:").concat(y, "."));
        if (this.board[y][x] == BoardElement.Restricted)
            throw new Error("Tried removeBall on restricted coordinate: x:".concat(x, ", y:").concat(y, "."));
        if (this.board[y][x] == BoardElement.Empty)
            throw new Error("Tried removing on empty coordinate: x:".concat(x, ", y:").concat(y, "."));
        this.board[y][x] = BoardElement.Empty;
    };
    ;
    PegSolitaire.prototype.checkIfEligibleMove = function (_a) {
        var from = _a.from, to = _a.to;
        if (from.x < 0 || from.x >= this.boardWidth ||
            from.y < 0 || from.y >= this.boardHeight ||
            to.x < 0 || to.x >= this.boardWidth ||
            to.y < 0 || to.y >= this.boardHeight)
            return false;
        if (Math.sqrt(Math.pow((to.x - from.x), 2) + Math.pow((to.y - from.y), 2)) != 2)
            return false;
        if (this.board[from.y][from.x] == BoardElement.Restricted ||
            this.board[to.y][to.x] == BoardElement.Restricted ||
            this.board[(to.y + from.y) / 2][(to.x + from.x) / 2] == BoardElement.Restricted)
            return false;
        return true;
    };
    ;
    PegSolitaire.prototype.checkLegalityOfEligibleMove = function (_a) {
        var from = _a.from, to = _a.to;
        if (this.board[from.y][from.x] != BoardElement.Ball)
            return false;
        if (this.board[to.y][to.x] != BoardElement.Empty)
            return false;
        if (this.board[(to.y + from.y) / 2][(to.x + from.x) / 2] != BoardElement.Ball)
            return false;
        return true;
    };
    ;
    PegSolitaire.prototype.doMove = function (_a) {
        var from = _a.from, to = _a.to;
        this.board[from.y][from.x] = BoardElement.Empty;
        this.board[(to.y + from.y) / 2][(to.x + from.x) / 2] = BoardElement.Empty;
        this.board[to.y][to.x] = BoardElement.Ball;
    };
    ;
    PegSolitaire.prototype.undoMove = function (_a) {
        var from = _a.from, to = _a.to;
        this.board[from.y][from.x] = BoardElement.Ball;
        this.board[(to.y + from.y) / 2][(to.x + from.x) / 2] = BoardElement.Ball;
        this.board[to.y][to.x] = BoardElement.Empty;
    };
    ;
    PegSolitaire.prototype.findEligibleMovesForSetup = function () {
        var listOfMoves = [];
        for (var row = 0; row < this.boardHeight; row++) {
            for (var col = 0; col < this.boardWidth; col++) {
                if (this.checkIfEligibleMove({ from: { x: col, y: row }, to: { x: col - 2, y: row } }))
                    listOfMoves.push({ from: { x: col, y: row }, to: { x: col - 2, y: row } });
                if (this.checkIfEligibleMove({ from: { x: col, y: row }, to: { x: col + 2, y: row } }))
                    listOfMoves.push({ from: { x: col, y: row }, to: { x: col + 2, y: row } });
                if (this.checkIfEligibleMove({ from: { x: col, y: row }, to: { x: col, y: row - 2 } }))
                    listOfMoves.push({ from: { x: col, y: row }, to: { x: col, y: row - 2 } });
                if (this.checkIfEligibleMove({ from: { x: col, y: row }, to: { x: col, y: row + 2 } }))
                    listOfMoves.push({ from: { x: col, y: row }, to: { x: col, y: row + 2 } });
            }
        }
        return listOfMoves;
    };
    PegSolitaire.prototype.printEligibleMovesForSetup = function () {
        console.log(this.eligibleMoves);
    };
    PegSolitaire.prototype.findNonRestrictedCoords = function () {
        var listOfCoords = [];
        for (var row = 0; row < this.boardHeight; row++) {
            for (var col = 0; col < this.boardWidth; col++) {
                if (this.board[row][col] != BoardElement.Restricted)
                    listOfCoords.push({ x: col, y: row });
            }
        }
        return listOfCoords;
    };
    PegSolitaire.prototype.countBalls = function () {
        var _this = this;
        var ballCount = 0;
        this.nonRestrictedCoordinates.forEach(function (_a) {
            var x = _a.x, y = _a.y;
            if (_this.board[y][x] == BoardElement.Ball)
                ballCount++;
        });
        return ballCount;
    };
    PegSolitaire.prototype.findLegalMoves = function () {
        var _this = this;
        var listOfMoves = [];
        this.eligibleMoves.forEach(function (move) {
            if (_this.checkLegalityOfEligibleMove(move))
                listOfMoves.push(move);
        });
        return listOfMoves;
    };
    ;
    return PegSolitaire;
}());
exports.default = PegSolitaire;
;
