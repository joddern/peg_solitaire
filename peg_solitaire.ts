

enum BoardElement {
    Empty = 0,
    Ball = 1, 
    Restricted = 2,
}

type BoardCoord = {
    x: number,
    y: number,
}

type Move = {
    from: BoardCoord,
    to: BoardCoord,
}

const STANDARD_BOARD_WIDTH = 7;
const STANDARD_BOARD_HEIGHT = 7;
const STANDARD_BOARD_SETUP = [
    [BoardElement.Restricted, BoardElement.Restricted, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Restricted, BoardElement.Restricted],
    [BoardElement.Restricted, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Restricted],
    [BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball],
    [BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball],
    [BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball],
    [BoardElement.Restricted, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Restricted],
    [BoardElement.Restricted, BoardElement.Restricted, BoardElement.Ball, BoardElement.Ball, BoardElement.Ball, BoardElement.Restricted, BoardElement.Restricted],
];

class PegSolitaire {
    private boardWidth: number;
    private boardHeight: number;
    private board: BoardElement[][];
    private eligibleMoves: Move[];

    constructor(
        boardWidth: number = STANDARD_BOARD_WIDTH, 
        boardHeight: number = STANDARD_BOARD_HEIGHT, 
        board: BoardElement[][] = STANDARD_BOARD_SETUP,
        )
    {
        this.boardWidth=boardWidth;
        this.boardHeight=boardHeight;
        this.board=board;
        this.eligibleMoves = this.findEligibleMovesForSetup();
    }

    removeBall({ x, y }: BoardCoord): void {
        if (x < 0 || x >= this.boardWidth || 
            y < 0 || y >= this.boardHeight) throw new Error(`Tried removeBall outside of board: x:${x}, y:${y}.`);
        if (this.board[y][x] == BoardElement.Restricted) throw new Error(`Tried removeBall on restricted coordinate: x:${x}, y:${y}.`);
        if (this.board[y][x] == BoardElement.Empty) throw new Error(`Tried removing on empty coordinate: x:${x}, y:${y}.`);
        this.board[y][x] = BoardElement.Empty;
    };

    checkIfEligibleMove({ from, to }: Move): boolean {
        if (from.x < 0 || from.x >= this.boardWidth || 
            from.y < 0 || from.y >= this.boardHeight || 
            to.x < 0 || to.x >= this.boardWidth || 
            to.y < 0 || to.y >= this.boardHeight) return false;
        if (Math.sqrt((to.x - from.x)**2 + (to.y - from.y)**2) != 2) return false;
        if (this.board[from.y][from.x] == BoardElement.Restricted ||
            this.board[to.y][to.x] == BoardElement.Restricted ||
            this.board[(to.y + from.y) / 2][(to.x + from.x) / 2] == BoardElement.Restricted) return false;
        return true;
    };

    checkLegalityOfEligibleMove({ from, to }: Move): boolean {
        if (this.board[from.y][from.x] != BoardElement.Ball) return false;
        if (this.board[to.y][to.x] != BoardElement.Empty) return false;
        if (this.board[(to.y + from.y) / 2][(to.x + from.x) / 2] != BoardElement.Ball) return false;
        return true;
    };

    doMove({ from, to }: Move): void {
        this.board[from.y][from.x] = BoardElement.Empty;
        this.board[(to.y + from.y) / 2][(to.x + from.x) / 2] = BoardElement.Empty;
        this.board[to.y][to.x] = BoardElement.Ball;
    };

    findEligibleMovesForSetup(): Move[] {
        let listOfMoves: Move[] = [];
        for (let row = 0; row < this.boardHeight ; row++) {
            for (let col = 0; col < this.boardWidth ; col++) {
                if (this.checkIfEligibleMove({from: {x: col, y: row}, to: {x: col - 2, y: row}})) listOfMoves.push({from: {x: col, y: row}, to: {x: col - 2, y: row}});
                if (this.checkIfEligibleMove({from: {x: col, y: row}, to: {x: col + 2, y: row}})) listOfMoves.push({from: {x: col, y: row}, to: {x: col + 2, y: row}});
                if (this.checkIfEligibleMove({from: {x: col, y: row}, to: {x: col, y: row - 2}})) listOfMoves.push({from: {x: col, y: row}, to: {x: col, y: row - 2}});
                if (this.checkIfEligibleMove({from: {x: col, y: row}, to: {x: col, y: row + 2}})) listOfMoves.push({from: {x: col, y: row}, to: {x: col, y: row + 2}});
            }
        }
        return listOfMoves;
    }

    printEligibleMovesForSetup(): void {
        console.log(this.eligibleMoves);
    }

    findLegalMoves(): Move[] {
        let listOfMoves: Move[] = [];
        this.eligibleMoves.forEach((move) => {
            if (this.checkLegalityOfEligibleMove(move)) listOfMoves.push(move);
        });
        return listOfMoves;
    };
};

export default PegSolitaire;