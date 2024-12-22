import '../index.css';
import lessons from '../data/lessons.json';
import React, { useState, useEffect } from 'react';

const MainMenu = () => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isEnglishLayout, setIsEnglishLayout] = useState(true);
  const [errors, setErrors] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const lesson = lessons[currentLessonIndex];
  const targetCommand = lesson.text;
  const nextChar = targetCommand[inputText.length] || '';
  const maxErrors = Math.ceil(targetCommand.length * 0.03);

  const playErrorSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const requiresShift = (char) => {
    const shiftSymbols = [
      '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
      '_', '+', '{', '}', '|', ':', '"', '<', '>', '?',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
      'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
      'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    return shiftSymbols.includes(char);
  };

  const getKeyLabel = (char) => {
    if (char === '\n') return 'Enter';
    if (char === ' ') return 'SPACE';
    return char.toUpperCase();
  };

  const nextKeyLabels = requiresShift(nextChar)
    ? ['Shift', getKeyLabel(nextChar)]
    : [getKeyLabel(nextChar)];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isPaused || completed) return;

      let key = '';
      if (event.key === ' ') {
        key = ' ';
      } else if (event.key === 'Enter') {
        key = '\n';
      } else if (event.key.length === 1) {
        key = event.key;
      }

      if (!key) return;

      const isEnglish = /^[a-zA-Z0-9`~!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]$/.test(event.key);
      setIsEnglishLayout(isEnglish);

      if (key === nextChar) {
        const newInputText = inputText + key;
        setInputText(newInputText);

        if (newInputText === targetCommand) {
          setCompleted(true);
        }
      } else {
        setErrors((prev) => prev + 1);
        setIsPaused(true);
        playErrorSound();
        setTimeout(() => setIsPaused(false), 3000);
      }
    };

    const preventSpaceScroll = (event) => {
      if (event.key === ' ') event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', preventSpaceScroll);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', preventSpaceScroll);
    };
  }, [inputText, nextChar, targetCommand, completed, isPaused]);

  const restartLesson = () => {
    setInputText('');
    setErrors(0);
    setCompleted(false);
  };

  const nextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex((prev) => prev + 1);
      restartLesson();
    }
  };

  const keyboardLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
    ['Shift-Left', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift-Right'],
    ['Control', 'Alt', 'SPACE', 'AltGr', 'Control', 'ArrowLeft', 'ArrowRight']
  ];

  return (
    <div className="w-full h-screen bg-gray-800 border-8 border-gray-500 rounded-lg shadow-lg flex flex-col relative">
      {isPaused && (
        <div className="overlay">
          <div className="loader"></div>
          <p className="text-green-500 text-xl mt-4">
            Ошибка. Продолжите через несколько секунд...
          </p>
        </div>
      )}

      <div className="absolute top-4 right-4 flex items-center justify-center">
        <div className="lamp-display">
          <div className={`lamp-indicator ${isEnglishLayout ? 'lamp-active' : 'lamp-inactive'}`}>
            <span className="lamp-text">{isEnglishLayout ? 'EN' : 'OFF'}</span>
          </div>
        </div>
      </div>

      <div className="main-display flex-1 flex flex-col justify-center items-center px-4">
        <h2 className="text-xl font-bold text-green-400 mb-4">{lesson.definition}</h2>
        <div className="main-display-text text-white text-lg" style={{ whiteSpace: 'pre-wrap', position: 'relative' }}>
          <span className="text-green-500">{inputText}</span>
          {!completed && <span className="caret"></span>}
          <span className="text-green-200">{targetCommand.slice(inputText.length)}</span>
        </div>
        <div className="errors mt-4">
          <p className="text-red-500">
            Ошибки: {errors} / {maxErrors}
          </p>
        </div>
      </div>

      <div className="keyboard flex flex-col items-center mb-8">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-2">
            {row.map((key) => {
              const displayKey = key.replace(/-.*$/, '');
              const isNextKey = nextKeyLabels.includes(displayKey);

              const isShiftHighlighted = 
                requiresShift(nextChar) && (displayKey === 'Shift-Left' || displayKey === 'Shift-Right');
              const highlightClass = isNextKey || isShiftHighlighted ? 'next-key-highlight' : '';

              return (
                <button
                  key={`${rowIndex}-${key}`}
                  className={`keyboard-key ${highlightClass}`}
                >
                  {displayKey}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-around mt-4 mb-8">
        <button onClick={restartLesson} className="btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Перезапустить
        </button>
        <button onClick={nextLesson} className="btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" disabled={!completed || errors > maxErrors}>
          Следующий урок
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
