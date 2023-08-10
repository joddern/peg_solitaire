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
    const board = this.gameBoard.getBoard();
    const fromCoord = move.from;
    const betweenCoord = {
      x: (move.to.x + move.from.x) / 2,
      y: (move.to.y + move.from.y) / 2,
    };
    const toCoord = move.to;

    // 1
    if (board[fromCoord.y - 1][fromCoord.x] === BoardElement.Ball) {
      if (board[fromCoord.y - 2][fromCoord.x] === BoardElement.Ball) {
        this.possibleMoves.push({
          from: { x: fromCoord.x, y: fromCoord.y - 2 },
          to: fromCoord,
        });
      } else if (board[fromCoord.y - 2][fromCoord.x] === BoardElement.Empty) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: { x: fromCoord.x, y: fromCoord.y - 2 },
          }),
          1
        );
      }

      // 2
      if (board[fromCoord.y + 1][fromCoord.x] === BoardElement.Empty) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: { x: fromCoord.x, y: fromCoord.y - 1 },
            to: { x: fromCoord.x, y: fromCoord.y + 1 },
          }),
          1
        );
      }
    }

    // 2
    if (board[fromCoord.y + 1][fromCoord.x] === BoardElement.Ball) {
      if (board[fromCoord.y + 2][fromCoord.x] === BoardElement.Ball) {
        this.possibleMoves.push({
          from: { x: fromCoord.x, y: fromCoord.y + 2 },
          to: fromCoord,
        });
      } else if (board[fromCoord.y - 2][fromCoord.x] === BoardElement.Empty) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: { x: fromCoord.x, y: fromCoord.y + 2 },
          }),
          1
        );
      }

      // 1
      if (board[fromCoord.y - 1][fromCoord.x] === BoardElement.Empty) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: { x: fromCoord.x, y: fromCoord.y + 1 },
            to: { x: fromCoord.x, y: fromCoord.y - 1 },
          }),
          1
        );
      }
    }

    // 3
    if (board[fromCoord.y][fromCoord.x - 1] === BoardElement.Ball) {
      if (board[fromCoord.y][fromCoord.x - 2] === BoardElement.Ball) {
        this.possibleMoves.push({
          from: { x: fromCoord.x - 2, y: fromCoord.y },
          to: fromCoord,
        });
      } else if (board[fromCoord.y][fromCoord.x - 2] === BoardElement.Empty) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: fromCoord,
            to: { x: fromCoord.x - 2, y: fromCoord.y },
          }),
          1
        );
      }
    } else if (board[fromCoord.y][fromCoord.x - 1] === BoardElement.Empty) {
      this.possibleMoves.splice(
        this.possibleMoves.indexOf({
          from: { x: fromCoord.x + 1, y: fromCoord.y },
          to: { x: fromCoord.x - 1, y: fromCoord.y },
        }),
        1
      );
    }

    // 4
    if (board[betweenCoord.y - 1][betweenCoord.x] === BoardElement.Ball) {
      if (board[betweenCoord.y - 2][betweenCoord.x] === BoardElement.Ball) {
        this.possibleMoves.push({
          from: { x: betweenCoord.x, y: betweenCoord.y - 2 },
          to: betweenCoord,
        });
      } else if (
        board[betweenCoord.y - 2][betweenCoord.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: betweenCoord,
            to: { x: betweenCoord.x, y: betweenCoord.y - 2 },
          }),
          1
        );
      }

      // 5
      if (board[betweenCoord.y + 1][betweenCoord.x] === BoardElement.Empty) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: { x: betweenCoord.x, y: betweenCoord.y - 1 },
            to: { x: betweenCoord.x, y: betweenCoord.y + 1 },
          }),
          1
        );
      }
    }

    // 5
    if (board[betweenCoord.y + 1][betweenCoord.x] === BoardElement.Ball) {
      if (board[betweenCoord.y + 2][betweenCoord.x] === BoardElement.Ball) {
        this.possibleMoves.push({
          from: { x: betweenCoord.x, y: betweenCoord.y + 2 },
          to: betweenCoord,
        });
      } else if (
        board[betweenCoord.y - 2][betweenCoord.x] === BoardElement.Empty
      ) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: betweenCoord,
            to: { x: betweenCoord.x, y: betweenCoord.y + 2 },
          }),
          1
        );
      }

      // 4
      if (board[betweenCoord.y - 1][betweenCoord.x] === BoardElement.Empty) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: { x: betweenCoord.x, y: betweenCoord.y + 1 },
            to: { x: betweenCoord.x, y: betweenCoord.y - 1 },
          }),
          1
        );
      }
    }

    // 6
    if (board[toCoord.y][toCoord.x + 1] === BoardElement.Ball) {
      this.possibleMoves.push({
        from: { x: toCoord.x + 1, y: toCoord.y },
        to: betweenCoord,
      });
      if (board[toCoord.y][toCoord.x + 2] === BoardElement.Empty) {
        this.possibleMoves.push({
          from: toCoord,
          to: { x: toCoord.x + 2, y: toCoord.y },
        });
      } else if (board[toCoord.y][toCoord.x + 2] === BoardElement.Ball) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: { x: toCoord.x + 2, y: toCoord.y },
            to: toCoord,
          }),
          1
        );
      }
    }

    // 7
    if (board[toCoord.y - 1][toCoord.x] === BoardElement.Ball) {
      if (board[toCoord.y - 2][toCoord.x] === BoardElement.Ball) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: { x: toCoord.x, y: toCoord.y - 2 },
            to: toCoord,
          }),
          1
        );
      } else if (board[toCoord.y - 2][toCoord.x] === BoardElement.Empty) {
        this.possibleMoves.push({
          from: toCoord,
          to: { x: toCoord.x, y: toCoord.y - 2 },
        });
      }

      // 8
      if (board[toCoord.y + 1][toCoord.x] === BoardElement.Empty) {
        this.possibleMoves.push({
          from: { x: toCoord.x, y: toCoord.y - 1 },
          to: { x: toCoord.x, y: toCoord.y + 1 },
        });
      }
    }

    // 8
    if (board[toCoord.y + 1][toCoord.x] === BoardElement.Ball) {
      if (board[toCoord.y + 2][toCoord.x] === BoardElement.Ball) {
        this.possibleMoves.splice(
          this.possibleMoves.indexOf({
            from: { x: toCoord.x, y: toCoord.y + 2 },
            to: toCoord,
          }),
          1
        );
      } else if (board[toCoord.y + 2][toCoord.x] === BoardElement.Empty) {
        this.possibleMoves.push({
          from: toCoord,
          to: { x: toCoord.x, y: toCoord.y + 2 },
        });
      }

      // 7
      if (board[toCoord.y - 1][toCoord.x] === BoardElement.Empty) {
        this.possibleMoves.push({
          from: { x: toCoord.x, y: toCoord.y + 1 },
          to: { x: toCoord.x, y: toCoord.y - 1 },
        });
      }
    }
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
