import PegSolitaire, { Move, BoardElement } from "./peg_solitaire";

export type Board = {
  board: BoardElement[][];
};

export default class Solver {
  private gameBoard: PegSolitaire;
  private solutionSet: Move[];
  private unsolvablePositions: Board[];
  private ballsThreshold: number;

  private movesCounter: number;

  constructor(gameBoard: PegSolitaire, ballsThreshold: number) {
    this.gameBoard = gameBoard;
    this.solutionSet = [];
    this.unsolvablePositions = [];
    this.ballsThreshold = ballsThreshold;
    this.movesCounter = 0;
  }

  // Solver function must:
  // Find all possible moves right now:
  // - for each of these moves, play it, then recursively look for new moves
  // Stop if there is only a few balls left.
  // When there there are no possible moves, check how many balls are left
  // No moves then remove the last done move
  isUnsolvable(board: Board): boolean {
    this.unsolvablePositions.forEach((unsolvableBoard) => {
      if (areBoardsEqual(board, unsolvableBoard)) return true;
    });
    return false;
  }

  addMove(move: Move) {
    this.gameBoard.doMove(move);
    this.solutionSet.push(move);
  }

  removeMove(move: Move) {
    this.gameBoard.undoMove(move);
    this.solutionSet.pop(); // Only removes last, good enough?
  }

  solveGame(): boolean {
    const possibleMoves: Move[] = this.gameBoard.findLegalMoves();

    // Check how many balls left after a move
    if (this.gameBoard.countBalls() <= this.ballsThreshold) return true;

    // Check if this position is unsolvable
    if (
      this.isUnsolvable({ board: this.gameBoard.getBoard() }) ||
      possibleMoves.length === 0
    )
      return false;

    for (let i = 0; i < possibleMoves.length; i++) {
      const currentMove: Move = possibleMoves[i];
      this.addMove(currentMove);
      console.log(this.movesCounter++);

      // Since there are more balls left and possible moves, reccur
      const gameSolved: boolean = this.solveGame();
      if (gameSolved) return true;

      // If the game has returned not true, then go back one step
      this.removeMove(currentMove);
    }

    // If all moves are checked, none returned true games, then return further
    // TODO:
    // This should also add a board to unSolvableBoard.
    this.unsolvablePositions.push({ board: this.gameBoard.getBoard() });
    return false;
  }

  getSolution(): Move[] {
    return this.solutionSet;
  }

  printSolutionSet(): void {
    console.log(this.solutionSet);
    console.log(this.unsolvablePositions.length);
  }
}

function areBoardsEqual(board1: Board, board2: Board): boolean {
  return JSON.stringify(board1) === JSON.stringify(board2);
}
