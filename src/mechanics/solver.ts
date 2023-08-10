import PegSolitaire, { BoardElement, Move } from "./peg_solitaire";

export default class Solver {
  private gameBoard: PegSolitaire;
  private solutionSet: Move[];
  private unsolvablePositions: string[];
  private ballsThreshold: number;
  private boardBallCount: number;
  private possibleMoves: Move[];

  private movesCounter: number;

  constructor(gameBoard: PegSolitaire, ballsThreshold: number) {
    this.gameBoard = gameBoard;
    this.solutionSet = [];
    this.unsolvablePositions = [];
    this.ballsThreshold = ballsThreshold;
    this.boardBallCount = gameBoard.countBalls();
    this.possibleMoves = gameBoard.findLegalMoves();
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

  checkLegalMoveFast(board: BoardElement[][], { from, to }: Move): boolean {
    if (board[from.y][from.x] !== BoardElement.Ball) return false;
    if (board[to.y][to.x] !== BoardElement.Empty) return false;
    if (board[(to.y + from.y) / 2][(to.x + from.x) / 2] !== BoardElement.Ball)
      return false;
    return true;
  }

  checkLegalFromAndToAssumedMiddle(
    board: BoardElement[][],
    { from, to }: Move
  ): boolean {
    if (board[from.y][from.x] !== BoardElement.Ball) return false;
    if (board[to.y][to.x] !== BoardElement.Empty) return false;
    if (board[(to.y + from.y) / 2][(to.x + from.x) / 2] !== BoardElement.Ball)
      return false;
    return true;
  }

  updatePossibleMovesBasedOnExecutedMove(move: Move) {
    const fromCoord = move.from;
    const betweenCoord = {
      x: (move.to.x + move.from.x) / 2,
      y: (move.to.y + move.from.y) / 2,
    };
    const toCoord = move.to;
    // Remove moves that are no longer possible
    // 1
    let index = this.possibleMoves.indexOf({
      from: { x: fromCoord.x, y: fromCoord.y - 1 },
      to: { x: fromCoord.x, y: fromCoord.y + 1 },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 2
    index = this.possibleMoves.indexOf({
      from: { x: fromCoord.x, y: fromCoord.y + 1 },
      to: { x: fromCoord.x, y: fromCoord.y - 1 },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 3
    index = this.possibleMoves.indexOf({
      from: { x: fromCoord.x + 1, y: fromCoord.y },
      to: { x: fromCoord.x - 1, y: fromCoord.y },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 4
    index = this.possibleMoves.indexOf({
      from: { x: fromCoord.x, y: fromCoord.y },
      to: { x: fromCoord.x - 2, y: fromCoord.y },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 5
    index = this.possibleMoves.indexOf({
      from: { x: fromCoord.x, y: fromCoord.y },
      to: { x: fromCoord.x, y: fromCoord.y - 2 },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 6
    index = this.possibleMoves.indexOf({
      from: { x: fromCoord.x, y: fromCoord.y },
      to: { x: fromCoord.x, y: fromCoord.y + 2 },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 7
    index = this.possibleMoves.indexOf({
      from: { x: betweenCoord.x, y: betweenCoord.y + 1 },
      to: { x: betweenCoord.x, y: betweenCoord.y - 1 },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 8
    index = this.possibleMoves.indexOf({
      from: { x: betweenCoord.x, y: betweenCoord.y - 1 },
      to: { x: betweenCoord.x, y: betweenCoord.y + 1 },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 9
    index = this.possibleMoves.indexOf({
      from: { x: betweenCoord.x, y: betweenCoord.y },
      to: { x: betweenCoord.x, y: betweenCoord.y - 2 },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 10
    index = this.possibleMoves.indexOf({
      from: { x: betweenCoord.x, y: betweenCoord.y },
      to: { x: betweenCoord.x, y: betweenCoord.y + 2 },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 11
    index = this.possibleMoves.indexOf({
      from: { x: toCoord.x, y: toCoord.y - 2 },
      to: { x: toCoord.x, y: toCoord.y },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 12
    index = this.possibleMoves.indexOf({
      from: { x: toCoord.x, y: toCoord.y + 2 },
      to: { x: toCoord.x, y: toCoord.y },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // 13
    index = this.possibleMoves.indexOf({
      from: { x: toCoord.x + 2, y: toCoord.y },
      to: { x: toCoord.x, y: toCoord.y },
    });
    if (index > -1) {
      this.possibleMoves.splice(index, 1);
    }

    // Add new possible moves
    // 1
  }

  solveGame(): boolean {
    // Check how many balls left after a move
    if (this.boardBallCount <= this.ballsThreshold) return true;

    // Check if this position is unsolvable
    if (
      this.unsolvablePositions.includes(JSON.stringify(this.gameBoard)) ||
      this.possibleMoves.length === 0
    )
      return false;

    const currentMove: Move = this.possibleMoves[0];
    this.addMove(currentMove);
    this.boardBallCount--;
    console.log(this.movesCounter++);

    // Since there are more balls left and possible moves, reccur
    const gameSolved: boolean = this.solveGame();
    if (gameSolved) return true;

    // If the game has returned not true, then go back one step
    this.removeMove(currentMove);
    this.boardBallCount++;

    // If all moves are checked, none returned true games, then return further
    // TODO:
    // This should also add a board to unSolvableBoard.
    this.unsolvablePositions.push(JSON.stringify(this.gameBoard.getBoard()));
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
