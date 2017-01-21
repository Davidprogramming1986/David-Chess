function MOVE(from, to captured, promoted, flag) {
	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

/*

GameBoard.moveListStart[] -> index for first mobe at a given play
GameBoard.moveList[index]

say ply 1 loop all moves
for(index = GameBoard.moveListStart[1]; index < GameBoard.movelistStart[2]; index++) {
move = moveList[index];

.. use move

Gameboard.moveListStart[2] = GameBoard.moveListStart[1];
AddMove(move) 
GameBoard.movelist[GameBoard.movelISTsTART[2]] = Move;
GamebOARD.MOVElistsTART[2]++

*/

function GenerateMoves() {
	GameBoard.moveListStart[GameBoard.ply+1] = GameBoard.moveListStart[GameBoard.ply];

	let pceType;
	let pceNum;
	let sq;

	if(GameBoard.side == COLOURS.WHITE) {
		pceType = PIECES.wP;

		for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceType++) {
			sq = GameBoard.pList[PCEINDEX(pceTpye, pceNum)];

			if(GameBoard.piece[sq + 10] == PIECES.EMPTY) {
				// Add Pawn Move
				if(RanksBrd[sq] == RANKS.RANK_2 && GameBoard.pieces[sq + 20] == PIECES.EMPTY) {
					// Add Queit Move Here
				}
			}

			if(SQOFFBOARD(sq + 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 9]] == COLOURS.BLACK) {
				// Add Pawn Cap Move
			}

			if(SQOFFBOARD(sq + 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq + 11]] == COLOURS.BLACK) {
				// Add Pawn Cap Move
			}

			if(Gameboard.enpas != SQUARES.NOSQ) {
				if(sq + 9 == GameBoard.enPas) {
					// Add enpas move
				}
				if(sq + 11 == GameBoard.enPas) {
					// Add enpas move
				}
			}
		}

		pceType = PIECE.wN
	} else {
		pceType = PIECES.bP;

		for(pceNum = 0; pceNum < GameBoard.pceNum[pceType]; pceType++) {
			sq = GameBoard.pList[PCEINDEX(pceTpye, pceNum)];

			if(GameBoard.piece[sq - 10] == PIECES.EMPTY) {
				// Add Pawn Move
				if(RanksBrd[sq] == RANKS.RANK_7 && GameBoard.pieces[sq - 20] == PIECES.EMPTY) {
					// Add Queit Move Here
				}
			}

			if(SQOFFBOARD(sq - 9) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 9]] == COLOURS.WHITE) {
				// Add Pawn Cap Move
			}

			if(SQOFFBOARD(sq - 11) == BOOL.FALSE && PieceCol[GameBoard.pieces[sq - 11]] == COLOURS.WHITE) {
				// Add Pawn Cap Move
			}

			if(Gameboard.enpas != SQUARES.NOSQ) {
				if(sq - 9 == GameBoard.enPas) {
					// Add enpas move
				}
				if(sq - 11 == GameBoard.enPas) {
					// Add enpas move
				}
			}
		}

		pceType = PIECE.bN
	}
}