import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, GameState } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Trophy, RotateCcw, Play } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const moveSnake = useCallback(() => {
    setSnake((prev) => {
      const newHead = {
        x: (prev[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prev[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prev.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
        setGameState(GameState.GAME_OVER);
        return prev;
      }

      const newSnake = [newHead, ...prev];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food]);

  const generateFood = (currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y)) break;
    }
    setFood(newFood);
  };

  useEffect(() => {
    if (gameState !== GameState.PLAYING) return;

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [gameState, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#22d3ee' : '#0891b2'; // Cyan neon
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#22d3ee';
      
      // Rounded snake segments
      const x = seg.x * cellSize + 2;
      const y = seg.y * cellSize + 2;
      const size = cellSize - 4;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 4);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#f472b6'; // Pink neon
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#f472b6';
    const fx = food.x * cellSize + 4;
    const fy = food.y * cellSize + 4;
    const fsize = cellSize - 8;
    ctx.beginPath();
    ctx.arc(fx + fsize / 2, fy + fsize / 2, fsize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow for performance
    ctx.shadowBlur = 0;
  }, [snake, food]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameState(GameState.PLAYING);
    generateFood(INITIAL_SNAKE);
  };

  return (
    <div className="relative flex flex-col items-center gap-6 p-8 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden" id="snake-game-container">
      {/* HUD */}
      <div className="w-full flex justify-between items-center px-4" id="game-hud">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">CURRENT SCORE</p>
          <p className="text-5xl font-black text-white tabular-nums tracking-tighter">{score}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-pink-500 font-bold flex items-center justify-end gap-1">
            <Trophy size={10} className="fill-pink-500" /> HIGH SCORE
          </p>
          <p className="text-4xl font-black text-white/90 tabular-nums tracking-tighter">{highScore}</p>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black rounded-lg border border-white/5 cursor-crosshair shadow-2xl"
          id="snake-canvas"
        />

        <AnimatePresence>
          {gameState !== GameState.PLAYING && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10"
              id="game-overlay"
            >
              <h2 className="text-6xl font-black text-white mb-6 tracking-tighter italic">
                {gameState === GameState.START ? 'NEON RHYTHM' : 'GA_ME OV_ER'}
              </h2>
              
              {gameState === GameState.GAME_OVER && (
                <p className="text-cyan-400 font-black uppercase tracking-[0.25em] text-[12px] mb-10">SCORE: {score}</p>
              )}

              <button
                onClick={resetGame}
                className="group relative px-10 py-4 bg-white text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                id="game-action-btn"
              >
                <div className="relative z-10 flex items-center gap-3 uppercase tracking-tighter text-sm">
                  {gameState === GameState.START ? <Play size={18} fill="currentColor" /> : <RotateCcw size={18} strokeWidth={3} />}
                  {gameState === GameState.START ? 'START ENGINE' : 'RETRY SYSTEM'}
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold" id="game-controls-hint">
        USE ARROW KEYS TO NAVIGATE
      </div>
    </div>
  );
};
