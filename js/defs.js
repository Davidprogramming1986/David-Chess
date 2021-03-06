// Using ES6

const PIECES = {EMPTY: 0, wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK:6, bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12};

const BRD_SQ_NUM = 120;

const FILES = {FILE_A: 0, FILE_B: 1, FILE_C: 2, FILE_D: 3, FILE_E: 4, FILE_F: 5, FILE_G: 6, FILE_H: 7, FILE_NONE: 8};
const RANKS = {RANK_1: 0, RANK_2: 1, RANK_3: 2, RANK_4: 3, RANK_5: 4, RANK_6: 5, RANK_7: 6, RANK_8: 7, RANK_NONE: 8};

const COLOURS = {WHITE: 0, BLACK: 1, BOTH: 2};

const CASTLEBIT = {WKCA: 1, WQCA: 2, BKCA: 4, BQCA: 8};

const SQUARES = {A1: 21, B1: 22, C1: 23, D1: 24, E1: 25, F1: 26, G1: 27, H1: 28,
				 A8: 91, B8: 92, C8: 93, D8: 94, E8: 95, F8: 96, G8: 97, H8: 98,
				 NO_SQ: 99, OFFBOARD: 100};

const BOOL = {FALSE:0, TRUE: 1};

let MAXGAMEMOVES = 2048;
let MAXPOSITIONMOVES = 256;
let MAXDEPTH = 64;

let FilesBrd = new Array(BRD_SQ_NUM);
let RanksBrd = new Array(BRD_SQ_NUM);

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const PceChar = '.PNBRQKpnbrqk';
const SideChar = 'wb-';
const RankChar = '12345678';
const FileChar = 'abcdefgh';

function FileRankToSquare(file, rank) {
	return ( (21 + file) + (rank * 10));
}

const PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
const PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
const PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
const PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
const PieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
	COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK ];

const PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];	
const PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
const PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];
const PieceRookQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
const PieceBishopQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
const PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];


let KnDir = [-8, -19, -21, -12, 8, 19, 21, 12];
let RkDir = [-1, -10, 1, 10];
let BiDir = [-9, -11, 11, 9];
let KiDir = [-1, -10, 1, 10, -9, -11, 11, 9];

let PieceKeys = new Array(14 * 120);
let SideKey;
let CastleKeys = new Array(16);

let Sq120ToSq64 = new Array(BRD_SQ_NUM);
let Sq64ToSq120 = new Array(64);

function RAND_32() {
	return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16)
		  | (Math.floor((Math.random() * 255) + 1) << 8) | (Math.floor(Math.random() * 255) + 1);
}

function SQ64(sq120) {
	return Sq120ToSq64[(sq120)];
}

function SQ120(sq64) {
	return Sq64ToSq120[(sq64)];
}

function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

/*
How the moves are going to be stored on a 32 bit binary:
0000 0000 0000 0000 0000 0111 1111 -> From 0x7F
0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7F
0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xF
0000 0000 0100 0000 0000 0000 0000 -> EP 0X40000
0000 0000 1000 0000 0000 0000 0000 -> Pawn Start 0x80000
0000 1111 0000 0000 0000 0000 0000 -> Promoted Piece >> 20, 0xF;
0001 0000 0000 0000 0000 0000 0000 -> Castle 0x1000000
*/

function MOVE(from, to captured, promoted, flag) {
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function FROMSQ(m) { return (m & 0x7F); }
function TOSQ(m) { return ((m>> 7) & 0x7F); }
function CAPTURED(m) { return ((m >> 14) & 0x7F); }
function PROMOTED(m) { return ((m >> 20) & 0x7F); }

let MFLAGEP = 0x40000;
let MFLAGPS = 0X80000;
let MFLAGCA = 0x100000;

let MFLAGCAP = 0x7C000;
let MFLAGPROM = 0xF00000;

let NOMOVE = 0;


