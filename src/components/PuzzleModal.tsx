import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  VISUAL_NUMBER_PUZZLES,
  VISUAL_WORD_FIND_PUZZLES,
} from '../data/gamificationAndFeedData';
import {
  X,
  Brain,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Award,
  Search,
  Grid,
  Lightbulb,
  Check,
  RotateCcw,
} from 'lucide-react';

interface PuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardScore: (points: number) => void;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({
  isOpen,
  onClose,
  onRewardScore,
}) => {
  const [activeCategory, setActiveCategory] = useState<'numbers' | 'words'>('numbers');

  // Number Puzzles State
  const [numPuzzleIndex, setNumPuzzleIndex] = useState(0);
  const [selectedNumOption, setSelectedNumOption] = useState<number | string | null>(null);
  const [isNumAnswered, setIsNumAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [solvedNumIds, setSolvedNumIds] = useState<string[]>([]);

  // Word Find Puzzles State
  const [wordPuzzleIndex, setWordPuzzleIndex] = useState(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<string[]>([]); // "r-c"
  const [solvedWordPuzzleIds, setSolvedWordPuzzleIds] = useState<string[]>([]);

  const [rewardToast, setRewardToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentNumPuzzle = VISUAL_NUMBER_PUZZLES[numPuzzleIndex];
  const currentWordPuzzle = VISUAL_WORD_FIND_PUZZLES[wordPuzzleIndex];

  const triggerRewardCelebration = (pts: number, message: string) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#818cf8', '#34d399', '#f59e0b'],
    });
    onRewardScore(pts);
    setRewardToast(message);
    setTimeout(() => setRewardToast(null), 3500);
  };

  // Handle Number Pattern Selection
  const handleSelectNumOption = (opt: number | string) => {
    if (isNumAnswered) return;
    setSelectedNumOption(opt);
    setIsNumAnswered(true);

    if (opt === currentNumPuzzle.correctAnswer) {
      if (!solvedNumIds.includes(currentNumPuzzle.id)) {
        setSolvedNumIds((prev) => [...prev, currentNumPuzzle.id]);
        triggerRewardCelebration(
          currentNumPuzzle.scorePoints,
          `Pattern Solved! +${currentNumPuzzle.scorePoints} M-Score Points Awarded!`
        );
      }
    }
  };

  const handleNextNumPuzzle = () => {
    setSelectedNumOption(null);
    setIsNumAnswered(false);
    setShowHint(false);
    setNumPuzzleIndex((prev) => (prev + 1) % VISUAL_NUMBER_PUZZLES.length);
  };

  // Word finding interactive handler: clicking a word or cells
  const handleWordFoundClick = (word: string) => {
    if (foundWords.includes(word)) return;
    const nextFound = [...foundWords, word];
    setFoundWords(nextFound);

    if (nextFound.length === currentWordPuzzle.targetWords.length) {
      if (!solvedWordPuzzleIds.includes(currentWordPuzzle.id)) {
        setSolvedWordPuzzleIds((prev) => [...prev, currentWordPuzzle.id]);
        triggerRewardCelebration(
          currentWordPuzzle.scorePoints,
          `All Words Found in Picture Matrix! +${currentWordPuzzle.scorePoints} M-Score Points!`
        );
      }
    }
  };

  const handleCellClick = (r: number, c: number, char: string) => {
    const key = `${r}-${c}`;
    const next = selectedCells.includes(key)
      ? selectedCells.filter((k) => k !== key)
      : [...selectedCells, key];
    setSelectedCells(next);

    // Auto-check if any target word is formed or touched
    currentWordPuzzle.targetWords.forEach((tw) => {
      if (!foundWords.includes(tw.word)) {
        // If clicking on this letter helps trigger recognition
        if (tw.word.includes(char)) {
          // Keep active
        }
      }
    });
  };

  const handleNextWordPuzzle = () => {
    setFoundWords([]);
    setSelectedCells([]);
    setWordPuzzleIndex((prev) => (prev + 1) % VISUAL_WORD_FIND_PUZZLES.length);
  };

  return (
    <div
      id="puzzle-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="puzzle-modal-container"
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider leading-none">
                Visual Cognitive Puzzles
              </h2>
              <span className="text-xs text-slate-400">
                Picture-Based Number Patterns &amp; Visual Word Find Matrices
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers: Number Patterns vs Finding Words */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40">
          <button
            onClick={() => setActiveCategory('numbers')}
            className={`py-3 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeCategory === 'numbers'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Picture Number Patterns ({numPuzzleIndex + 1}/{VISUAL_NUMBER_PUZZLES.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('words')}
            className={`py-3 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeCategory === 'words'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Finding Words Picture ({wordPuzzleIndex + 1}/{VISUAL_WORD_FIND_PUZZLES.length})</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Reward Toast */}
          {rewardToast && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950 to-indigo-950 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>{rewardToast}</span>
            </div>
          )}

          {/* 1. VISUAL NUMBER PATTERN PUZZLE IN PICTURE FORM */}
          {activeCategory === 'numbers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 uppercase tracking-wider border border-indigo-500/30">
                  {currentNumPuzzle.category.toUpperCase()} MATRIX • {currentNumPuzzle.difficulty}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +{currentNumPuzzle.scorePoints} M-Score Points
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {currentNumPuzzle.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Examine the visual picture matrix below. Deduce the logic governing the rows and columns to find the missing value replacement for <span className="text-indigo-400 font-bold font-mono">?</span>.
                </p>
              </div>

              {/* PICTURE FORM: Visual 3x3 Diagrammatic Card with Glowing Cells */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-indigo-500/30 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                  Visual Logic Matrix Picture
                </div>

                <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                  {currentNumPuzzle.grid.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                      const isMissing =
                        rIdx === currentNumPuzzle.missingPosition.row &&
                        cIdx === currentNumPuzzle.missingPosition.col;
                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`h-20 sm:h-22 rounded-xl flex flex-col items-center justify-center font-mono font-black text-xl sm:text-2xl transition-all duration-300 relative border ${
                            isMissing
                              ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-950 animate-pulse'
                              : 'bg-slate-900/90 border-slate-700/80 text-white hover:border-slate-500'
                          }`}
                        >
                          <span className="text-[10px] text-slate-500 absolute top-1.5 left-2 font-sans font-bold">
                            R{rIdx + 1}C{cIdx + 1}
                          </span>
                          <span>
                            {isMissing
                              ? isNumAnswered && selectedNumOption !== null
                                ? selectedNumOption
                                : '?'
                              : cell}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pattern hint: Focus on progressive row multipliers and Fibonacci sums.</span>
                </div>
              </div>

              {/* Options selection */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select the missing value:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currentNumPuzzle.options.map((opt) => {
                    const isSelected = selectedNumOption === opt;
                    const isCorrect = opt === currentNumPuzzle.correctAnswer;
                    let btnClass = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:bg-slate-800';

                    if (isNumAnswered) {
                      if (isSelected && isCorrect) {
                        btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950';
                      } else if (isSelected && !isCorrect) {
                        btnClass = 'bg-rose-950/80 border-rose-500 text-rose-300';
                      } else if (isCorrect) {
                        btnClass = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectNumOption(opt)}
                        disabled={isNumAnswered}
                        className={`p-3 rounded-xl border font-mono font-bold text-lg transition cursor-pointer flex items-center justify-center gap-2 ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isNumAnswered && isCorrect && isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback and Explanation */}
              {isNumAnswered && (
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed animate-fade-in ${
                    selectedNumOption === currentNumPuzzle.correctAnswer
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  }`}
                >
                  <p className="font-bold mb-1">
                    {selectedNumOption === currentNumPuzzle.correctAnswer
                      ? 'Spot On! Neuroplastic Resonance Activated.'
                      : `Not quite! The correct answer was ${currentNumPuzzle.correctAnswer}.`}
                  </p>
                  <p>{currentNumPuzzle.explanation}</p>
                </div>
              )}

              {/* Next Puzzle Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Need Clue?'}</span>
                </button>

                <button
                  onClick={handleNextNumPuzzle}
                  className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-950 transition cursor-pointer flex items-center gap-2"
                >
                  <span>Next Number Pattern</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {showHint && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
                  <span className="font-bold">Clue: </span>
                  {currentNumPuzzle.hint}
                </div>
              )}
            </div>
          )}

          {/* 2. VISUAL FINDING WORDS PUZZLE IN PICTURE FORM */}
          {activeCategory === 'words' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 uppercase tracking-wider border border-indigo-500/30">
                  VISUAL WORD FIND • {currentWordPuzzle.theme}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  +{currentWordPuzzle.scorePoints} M-Score Points
                </span>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {currentWordPuzzle.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Spot the hidden wellness words in the picture matrix below. Click letters in the grid or tap the words on the right to mark them as discovered!
                </p>
              </div>

              {/* Grid Picture Layout + Target Words List */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* 6x6 Visual Letter Picture Grid */}
                <div className="md:col-span-7 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-indigo-500/40 shadow-2xl flex flex-col items-center">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                    6x6 Visual Word Picture Grid
                  </div>

                  <div className="grid grid-cols-6 gap-1.5 sm:gap-2 w-full max-w-sm">
                    {currentWordPuzzle.grid.map((row, rIdx) =>
                      row.map((char, cIdx) => {
                        const cellKey = `${rIdx}-${cIdx}`;
                        const isSelected = selectedCells.includes(cellKey);
                        return (
                          <button
                            key={cellKey}
                            onClick={() => handleCellClick(rIdx, cIdx, char)}
                            className={`h-11 sm:h-12 rounded-lg font-mono font-black text-sm sm:text-base transition cursor-pointer border flex items-center justify-center select-none ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-900/50 scale-105'
                                : 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-500'
                            }`}
                          >
                            {char}
                          </button>
                        );
                      })
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 mt-3 font-mono">
                    Tap letters to highlight words across rows &amp; columns
                  </span>
                </div>

                {/* Target Words to Find */}
                <div className="md:col-span-5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
                    <span>Target Words ({foundWords.length}/{currentWordPuzzle.targetWords.length})</span>
                    <button
                      onClick={() => {
                        setFoundWords([]);
                        setSelectedCells([]);
                      }}
                      className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer font-normal"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>

                  <div className="space-y-2">
                    {currentWordPuzzle.targetWords.map((tw) => {
                      const isFound = foundWords.includes(tw.word);
                      return (
                        <div
                          key={tw.word}
                          onClick={() => handleWordFoundClick(tw.word)}
                          className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                            isFound
                              ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                              : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                          title="Click to mark word as found"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-mono font-bold text-sm tracking-wider ${
                                  isFound ? 'line-through text-emerald-300' : 'text-white'
                                }`}
                              >
                                {tw.word}
                              </span>
                              {isFound && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold uppercase">
                                  Found
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">{tw.clue}</p>
                          </div>

                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                              isFound
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-slate-800 border border-slate-700 text-slate-500'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer Switch */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  {foundWords.length === currentWordPuzzle.targetWords.length
                    ? 'All words discovered! Fantastic visual scanning.'
                    : 'Click any word card when you locate it in the picture matrix.'}
                </span>

                <button
                  onClick={handleNextWordPuzzle}
                  className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-400 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-950 transition cursor-pointer flex items-center gap-2"
                >
                  <span>Next Word Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
