import PegSolitaire, { Move, BoardElement } from "./peg_solitaire";

export type Board = {
    board: BoardElement[][];
} 

export default class Solver {
    private gameBoard: PegSolitaire;
    private solutionSet: Move[];
    private unsolvablePositions: Board[];
    private ballsThreshold: number;

    constructor(
        gameBoard: PegSolitaire, 
        ballsThreshold: number,
        )
    {
        this.gameBoard = gameBoard;
        this.solutionSet = [];
        this.unsolvablePositions = [];
        this.ballsThreshold = ballsThreshold;
    };
    
    // Solver function must:
    // Find all possible moves right now:
    // - for each of these moves, play it, then recursively look for new moves
    // Stop if there is only a few balls left.
    // When there there are no possible moves, check how many balls are left
    // No moves then remove the last done move
    isUnsolvable(board: Board): boolean {
        this.unsolvablePositions.forEach((unsolvableBoard) => {
            if (areBoardsEqual(board, unsolvableBoard)) return false;
        });
        return true;
    };

    addMove(move: Move) {
        this.gameBoard.doMove(move);
        this.solutionSet.push(move);
    }

    removeMove(move: Move) {
        this.gameBoard.undoMove(move);
        this.solutionSet.pop(); // Only removes last, good enough?
    }

    solveGame() {

        const possibleMoves: Move[] = this.gameBoard.findLegalMoves();

        for (let i = 0 ; i < possibleMoves.length ; i++) {
            const currentMove: Move = possibleMoves[i];
            this.addMove(currentMove);

            // Check if this position is unsolvable
            if (this.isUnsolvable({ board: this.gameBoard.getBoard() })) {
                this.removeMove(currentMove);
                continue;
            }

            // Check how many balls left after this move
            



        }
    };

};

function areBoardsEqual(board1: Board, board2: Board): boolean {
    return JSON.stringify(board1) == JSON.stringify(board2);
};