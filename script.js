document.addEventListener('DOMContentLoaded', function() {
    const board = document.querySelector('.board');
    let currentPlayer = 'X';
    let winner = false;
    let cells = Array.from({ length: 9 });
  
    function createBoard() {
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
        cells[i] = '';
      }
    }
  
    function handleCellClick(e) {
      const index = e.target.dataset.index;
      if (cells[index] === '' && !winner) {
        cells[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        if (checkWinner(cells, currentPlayer)) {
          winner = true;
          alert(currentPlayer + ' wins!');
          resetGame();
        } else if (cells.every(cell => cell !== '')) {
          alert('It\'s a draw!');
          resetGame();
        } else {
          currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
          if (currentPlayer === 'O') {
            setTimeout(() => {
              cpuMove();
            }, 500);
          }
        }
      }
    }
  
    function cpuMove() {
      let bestMove = minimax(cells, currentPlayer).index;
      cells[bestMove] = currentPlayer;
      document.querySelector(`[data-index="${bestMove}"]`).textContent = currentPlayer;
      if (checkWinner(cells, currentPlayer)) {
        winner = true;
        alert(currentPlayer + ' wins!');
        resetGame();
      } else if (cells.every(cell => cell !== '')) {
        alert('It\'s a draw!');
        resetGame();
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      }
    }
  
    function checkWinner(cells, player) {
      const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
      ];
  
      return winningCombos.some(combo => {
        return combo.every(index => cells[index] === player);
      });
    }
  
    function minimax(newBoard, player) {
      let availSpots = emptyIndices(newBoard);
  
      if (checkWinner(newBoard, 'X')) {
        return { score: -10 };
      } else if (checkWinner(newBoard, 'O')) {
        return { score: 10 };
      } else if (availSpots.length === 0) {
        return { score: 0 };
      }
  
      let moves = [];
      for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;
  
        if (player === 'O') {
          let result = minimax(newBoard, 'X');
          move.score = result.score;
        } else {
          let result = minimax(newBoard, 'O');
          move.score = result.score;
        }
  
        newBoard[availSpots[i]] = move.index;
        moves.push(move);
      }
  
      let bestMove;
      if (player === 'O') {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }
  
      return moves[bestMove];
    }
  
    function emptyIndices(board) {
      return board.map((cell, index) => cell === '' ? index : -1).filter(index => index !== -1);
    }
  
    function resetGame() {
      currentPlayer = 'X';
      winner = false;
      cells.forEach((_, index) => {
        cells[index] = '';
        document.querySelector(`[data-index="${index}"]`).textContent = '';
      });
    }
  
    createBoard();
  });
  