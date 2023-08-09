export enum BoardElement {
  Empty = 0,
  Ball = 1,
  Restricted = 2,
}

export type BoardCoord = {
  x: number;
  y: number;
};

export type Move = {
  from: BoardCoord;
  to: BoardCoord;
};

const STANDARD_BOARD_WIDTH: number = 7;
const STANDARD_BOARD_HEIGHT: number = 7;
const STANDARD_BOARD_SETUP: BoardElement[][] = [
  [
    BoardElement.Restricted,
    BoardElement.Restricted,
    BoardElement.Empty,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Restricted,
    BoardElement.Restricted,
  ],
  [
    BoardElement.Restricted,
    BoardElement.Restricted,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Restricted,
    BoardElement.Restricted,
  ],
  [
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
  ],
  [
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
  ],
  [
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
  ],
  [
    BoardElement.Restricted,
    BoardElement.Restricted,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Restricted,
    BoardElement.Restricted,
  ],
  [
    BoardElement.Restricted,
    BoardElement.Restricted,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Ball,
    BoardElement.Restricted,
    BoardElement.Restricted,
  ],
];

export default class PegSolitaire {
  private boardWidth: number;
  private boardHeight: number;
  private board: BoardElement[][];
  private eligibleMoves: Move[];
  private nonRestrictedCoordinates: BoardCoord[];

  constructor(
    boardWidth: number = STANDARD_BOARD_WIDTH,
    boardHeight: number = STANDARD_BOARD_HEIGHT,
    board: BoardElement[][] = STANDARD_BOARD_SETUP
  ) {
    this.boardWidth = boardWidth;
    this.boardHeight = boardHeight;
    this.board = board;
    this.eligibleMoves = this.findEligibleMovesForSetup();
    this.nonRestrictedCoordinates = this.findNonRestrictedCoords();
  }

  getWidth(): number {
    return this.boardWidth;
  }

  getHeight(): number {
    return this.boardHeight;
  }

  getBoard(): BoardElement[][] {
    return this.board;
  }

  removeBall({ x, y }: BoardCoord): void {
    if (x < 0 || x >= this.boardWidth || y < 0 || y >= this.boardHeight)
      throw new Error(`Tried removeBall outside of board: x:${x}, y:${y}.`);
    if (this.board[y][x] === BoardElement.Restricted)
      throw new Error(
        `Tried removeBall on restricted coordinate: x:${x}, y:${y}.`
      );
    if (this.board[y][x] === BoardElement.Empty)
      throw new Error(`Tried removing on empty coordinate: x:${x}, y:${y}.`);
    this.board[y][x] = BoardElement.Empty;
  }

  addBall({ x, y }: BoardCoord): void {
    if (x < 0 || x >= this.boardWidth || y < 0 || y >= this.boardHeight)
      throw new Error(`Tried addBall outside of board: x:${x}, y:${y}.`);
    if (this.board[y][x] === BoardElement.Restricted)
      throw new Error(
        `Tried addBall on restricted coordinate: x:${x}, y:${y}.`
      );
    if (this.board[y][x] === BoardElement.Ball)
      throw new Error(`Tried add on filled coordinate: x:${x}, y:${y}.`);
    this.board[y][x] = BoardElement.Ball;
  }

  toggleBall({ x, y }: BoardCoord): void {
    if (x < 0 || x >= this.boardWidth || y < 0 || y >= this.boardHeight)
      throw new Error(`Tried toggleBall outside of board: x:${x}, y:${y}.`);
    if (this.board[y][x] === BoardElement.Restricted) {
      return;
    }
    if (this.board[y][x] === BoardElement.Ball) {
      this.board[y][x] = BoardElement.Empty;
      return;
    }
    this.board[y][x] = BoardElement.Ball;
  }

  toggleRestricted({ x, y }: BoardCoord): void {
    if (x < 0 || x >= this.boardWidth || y < 0 || y >= this.boardHeight)
      throw new Error(
        `Tried toggleRestricted outside of board: x:${x}, y:${y}.`
      );
    if (this.board[y][x] === BoardElement.Restricted) {
      this.board[y][x] = BoardElement.Ball;
      return;
    }
    this.board[y][x] = BoardElement.Restricted;
  }

  checkIfEligibleMove({ from, to }: Move): boolean {
    if (
      from.x < 0 ||
      from.x >= this.boardWidth ||
      from.y < 0 ||
      from.y >= this.boardHeight ||
      to.x < 0 ||
      to.x >= this.boardWidth ||
      to.y < 0 ||
      to.y >= this.boardHeight
    )
      return false;
    if (Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2) !== 2)
      return false;
    if (
      this.board[from.y][from.x] === BoardElement.Restricted ||
      this.board[to.y][to.x] === BoardElement.Restricted ||
      this.board[(to.y + from.y) / 2][(to.x + from.x) / 2] ===
        BoardElement.Restricted
    )
      return false;
    return true;
  }

  checkLegalityOfEligibleMove({ from, to }: Move): boolean {
    if (this.board[from.y][from.x] !== BoardElement.Ball) return false;
    if (this.board[to.y][to.x] !== BoardElement.Empty) return false;
    if (
      this.board[(to.y + from.y) / 2][(to.x + from.x) / 2] !== BoardElement.Ball
    )
      return false;
    return true;
  }

  doMove({ from, to }: Move): void {
    this.board[from.y][from.x] = BoardElement.Empty;
    this.board[(to.y + from.y) / 2][(to.x + from.x) / 2] = BoardElement.Empty;
    this.board[to.y][to.x] = BoardElement.Ball;
  }

  undoMove({ from, to }: Move): void {
    this.board[from.y][from.x] = BoardElement.Ball;
    this.board[(to.y + from.y) / 2][(to.x + from.x) / 2] = BoardElement.Ball;
    this.board[to.y][to.x] = BoardElement.Empty;
  }

  findEligibleMovesForSetup(): Move[] {
    let listOfMoves: Move[] = [];
    for (let row = 0; row < this.boardHeight; row++) {
      for (let col = 0; col < this.boardWidth; col++) {
        if (
          this.checkIfEligibleMove({
            from: { x: col, y: row },
            to: { x: col - 2, y: row },
          })
        )
          listOfMoves.push({
            from: { x: col, y: row },
            to: { x: col - 2, y: row },
          });
        if (
          this.checkIfEligibleMove({
            from: { x: col, y: row },
            to: { x: col + 2, y: row },
          })
        )
          listOfMoves.push({
            from: { x: col, y: row },
            to: { x: col + 2, y: row },
          });
        if (
          this.checkIfEligibleMove({
            from: { x: col, y: row },
            to: { x: col, y: row - 2 },
          })
        )
          listOfMoves.push({
            from: { x: col, y: row },
            to: { x: col, y: row - 2 },
          });
        if (
          this.checkIfEligibleMove({
            from: { x: col, y: row },
            to: { x: col, y: row + 2 },
          })
        )
          listOfMoves.push({
            from: { x: col, y: row },
            to: { x: col, y: row + 2 },
          });
      }
    }
    return listOfMoves;
  }

  printEligibleMovesForSetup(): void {
    console.log(this.eligibleMoves);
  }

  findNonRestrictedCoords(): BoardCoord[] {
    let listOfCoords: BoardCoord[] = [];
    for (let row = 0; row < this.boardHeight; row++) {
      for (let col = 0; col < this.boardWidth; col++) {
        if (this.board[row][col] !== BoardElement.Restricted)
          listOfCoords.push({ x: col, y: row });
      }
    }
    return listOfCoords;
  }

  countBalls(): number {
    let ballCount: number = 0;
    this.nonRestrictedCoordinates.forEach(({ x, y }) => {
      if (this.board[y][x] === BoardElement.Ball) ballCount++;
    });
    return ballCount;
  }

  findLegalMoves(): Move[] {
    let listOfMoves: Move[] = [];
    this.eligibleMoves.forEach((move) => {
      if (this.checkLegalityOfEligibleMove(move)) listOfMoves.push(move);
    });
    return listOfMoves;
  }
}
