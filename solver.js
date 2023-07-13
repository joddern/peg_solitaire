"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Solver = /** @class */ (function () {
    function Solver(gameBoard, ballsThreshold) {
        this.gameBoard = gameBoard;
        this.solutionSet = [];
        this.unsolvablePositions = [];
        this.ballsThreshold = ballsThreshold;
        this.movesCounter = 0;
    }
    ;
    // Solver function must:
    // Find all possible moves right now:
    // - for each of these moves, play it, then recursively look for new moves
    // Stop if there is only a few balls left.
    // When there there are no possible moves, check how many balls are left
    // No moves then remove the last done move
    Solver.prototype.isUnsolvable = function (board) {
        this.unsolvablePositions.forEach(function (unsolvableBoard) {
            if (areBoardsEqual(board, unsolvableBoard))
                return true;
        });
        return false;
    };
    ;
    Solver.prototype.addMove = function (move) {
        this.gameBoard.doMove(move);
        this.solutionSet.push(move);
    };
    Solver.prototype.removeMove = function (move) {
        this.gameBoard.undoMove(move);
        this.solutionSet.pop(); // Only removes last, good enough?
    };
    Solver.prototype.solveGame = function () {
        var possibleMoves = this.gameBoard.findLegalMoves();
        // Check how many balls left after a move
        if (this.gameBoard.countBalls() <= this.ballsThreshold)
            return true;
        // Check if this position is unsolvable
        if (this.isUnsolvable({ board: this.gameBoard.getBoard() }) ||
            possibleMoves.length === 0)
            return false;
        for (var i = 0; i < possibleMoves.length; i++) {
            var currentMove = possibleMoves[i];
            this.addMove(currentMove);
            console.log(this.movesCounter++);
            // Since there are more balls left and possible moves, reccur
            var gameSolved = this.solveGame();
            if (gameSolved)
                return true;
            // If the game has returned not true, then go back one step
            this.removeMove(currentMove);
        }
        // If all moves are checked, none returned true games, then return further
        // TODO: 
        // This should also add a board to unSolvableBoard. 
        this.unsolvablePositions.push({ board: this.gameBoard.getBoard() });
        return false;
    };
    ;
    Solver.prototype.printSolutionSet = function () {
        console.log(this.solutionSet);
        console.log(this.unsolvablePositions.length);
    };
    return Solver;
}());
exports.default = Solver;
;
function areBoardsEqual(board1, board2) {
    return JSON.stringify(board1) == JSON.stringify(board2);
}
;
