

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
    private board_width: number;
    private board_height: number;
    private board: BoardElement[][];

    constructor(
        board_width: number = STANDARD_BOARD_WIDTH, 
        board_height: number = STANDARD_BOARD_HEIGHT, 
        board: BoardElement[][] = STANDARD_BOARD_SETUP,
        )
    {
        this.board_width=board_width;
        this.board_height=board_height;
        this.board=board;
    }

    removeBall({ x, y }: BoardCoord): void {
        if (x < 0 || x >= this.board_width || 
            y < 0 || y >= this.board_height) throw new Error(`Tried removeBall outside of board: x:${x}, y:${y}.`);
        if (this.board[y][x] == BoardElement.Restricted) throw new Error(`Tried removeBall on restricted coordinate: x:${x}, y:${y}.`);
        if (this.board[y][x] == BoardElement.Empty) throw new Error(`Tried removing on empty coordinate: x:${x}, y:${y}.`);
        this.board[y][x] = BoardElement.Empty;
    };

    checkMove({ from, to }: Move): boolean {
        if (from.x < 0 || from.x >= this.board_width || 
            from.y < 0 || from.y >= this.board_height || 
            to.x < 0 || to.x >= this.board_width || 
            to.y < 0 || to.y >= this.board_height) return false;
        if (Math.sqrt((to.x - from.x)**2 + (to.y - from.y)**2) != 2) return false;
        if (this.board[from.y][from.x] == BoardElement.Restricted ||
            this.board[to.y][to.x] == BoardElement.Restricted) return false;
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

    findAllLegalMoves(): Move[] {
        let listOfMoves: Move[] = [];
        for (let row = 0; row < this.board_height ; row++) {
            for (let col = 0; col < this.board_width ; col++) {
                if (this.checkMove({from: {x: col, y: row}, to: {x: col - 2, y: row}})) listOfMoves.push({from: {x: col, y: row}, to: {x: col - 2, y: row}});
                if (this.checkMove({from: {x: col, y: row}, to: {x: col + 2, y: row}})) listOfMoves.push({from: {x: col, y: row}, to: {x: col + 2, y: row}});
                if (this.checkMove({from: {x: col, y: row}, to: {x: col, y: row - 2}})) listOfMoves.push({from: {x: col, y: row}, to: {x: col, y: row - 2}});
                if (this.checkMove({from: {x: col, y: row}, to: {x: col, y: row + 2}})) listOfMoves.push({from: {x: col, y: row}, to: {x: col, y: row + 2}});
            }
        }
        return listOfMoves;
    };

    findBoardSetupMoves
};