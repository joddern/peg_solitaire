import PegSolitaire, { Move } from "./peg_solitaire";

export default class Solver {
  private gameBoard: PegSolitaire;
  private solutionSet: Move[];
  private unsolvablePositions: Set<string>;
  private ballsThreshold: number;
  private boardBallCount: number;
  private creationTime: number;

  private movesCounter: number;

  constructor(gameBoard: PegSolitaire, ballsThreshold: number) {
    this.gameBoard = gameBoard;
    this.solutionSet = [];
    this.unsolvablePositions = new Set<string>();
    this.ballsThreshold = ballsThreshold;
    this.boardBallCount = gameBoard.countBalls();
    this.creationTime = new Date().getTime();
    this.movesCounter = 0;
  }

  // Solver function must:
  // Find all possible moves right now:
  // - for each of these moves, play it, then recursively look for new moves
  // Stop if there is only a few balls left.
  // When there there are no possible moves, check how many balls are left
  // No moves then remove the last done move

  addMove(move: Move) {
    this.gameBoard.doMove(move);
    this.solutionSet.push(move);
  }

  removeMove(move: Move) {
    this.gameBoard.undoMove(move);
    this.solutionSet.pop(); // Only removes last, good enough?
  }

  solveGame(): boolean {
    // Check how many balls left after a move
    if (this.boardBallCount <= this.ballsThreshold) return true;

    const possibleMoves: Move[] = this.gameBoard.findLegalMoves();

    // Check if this position is unsolvable
    if (
      possibleMoves.length === 0 ||
      new Date().getTime() - this.creationTime > 10000 ||
      (this.boardBallCount > 12 &&
        this.unsolvablePositions.has(JSON.stringify(this.gameBoard)))
    ) {
      return false;
    }

    for (let i = 0; i < possibleMoves.length; i++) {
      const currentMove: Move = possibleMoves[i];
      this.addMove(currentMove);
      this.boardBallCount--;
      // console.log(this.movesCounter++);

      // Since there are more balls left and possible moves, reccur
      const gameSolved: boolean = this.solveGame();
      if (gameSolved) return true;

      // If the game has returned not true, then go back one step
      this.removeMove(currentMove);
      this.boardBallCount++;
    }

    // If all moves are checked, none returned true games, then return further
    // TODO:
    // This should also add a board to unSolvableBoard.
    if (this.boardBallCount > 12) {
      this.unsolvablePositions.add(JSON.stringify(this.gameBoard.getBoard()));
    }
    return false;
  }

  getSolution(): Move[] {
    return this.solutionSet;
  }

  printSolutionSet(): void {
    console.log(this.solutionSet);
  }
}
