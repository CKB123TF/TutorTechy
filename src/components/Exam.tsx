'use client'

import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

type Shape = 'line' | 'circle' | 'square' | 'triangle' | 'pentagon';
type Color = string;
type FillPercentage = number; // 0 to 100

interface Cell {
  shape: Shape;
  color: Color;
  fillPercentage: FillPercentage;
}

interface Question {
  id: number;
  matrix: (Cell | null)[][];
  correctAnswer: string;
  options: { [key: string]: Cell };
}

const ShapeSVG: React.FC<Cell> = ({ shape, color, fillPercentage }) => {
  const getPath = (shape: Shape): string => {
    switch (shape) {
      case 'line':
        return 'M0,50 L100,50';
      case 'circle':
        return 'M50,50 m-45,0 a45,45 0 1,0 90,0 a45,45 0 1,0 -90,0';
      case 'square':
        return 'M10,10 L90,10 L90,90 L10,90 Z';
      case 'triangle':
        return 'M50,10 L90,90 L10,90 Z';
      case 'pentagon':
        return 'M50,5 L90,40 L75,90 L25,90 L10,40 Z';
      default:
        return '';
    }
  };

  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`grad-${shape}-${color}`} x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={color} />
          <stop offset={`${fillPercentage}%`} stopColor={color} />
          <stop offset={`${fillPercentage}%`} stopColor="transparent" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d={getPath(shape)}
        fill={`url(#grad-${shape}-${color})`}
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  );
};

const MatrixDisplay: React.FC<{ matrix: (Cell | null)[][] }> = ({ matrix }) => (
  <div className="grid grid-cols-3 gap-1 w-60 h-60 w-full h-full">
    {matrix.flat().map((cell, index) => (
      <div key={index} className="border flex items-center justify-center">
        {cell ? (
          <ShapeSVG {...cell} />
        ) : index === 8 ? (
          <span className="text-4xl font-bold">?</span>
        ) : null}
      </div>
    ))}
  </div>
);

const questions: Question[] = [
  {
    id: 1,
    matrix: [
      [{ shape: 'circle', color: '#000000', fillPercentage: 0 }, { shape: 'square', color: '#FF0000', fillPercentage: 50 }, { shape: 'triangle', color: '#00FF00', fillPercentage: 100 }],
      [{ shape: 'circle', color: '#0000FF', fillPercentage: 50 }, { shape: 'square', color: '#FFFF00', fillPercentage: 100 }, { shape: 'triangle', color: '#FF00FF', fillPercentage: 0 }],
      [{ shape: 'circle', color: '#00FFFF', fillPercentage: 100 }, { shape: 'square', color: '#800080', fillPercentage: 0 }, null]
    ],
    correctAnswer: 'E',
    options: {
      A: { shape: 'circle', color: '#FFA500', fillPercentage: 30 },
      B: { shape: 'pentagon', color: '#008000', fillPercentage: 70 },
      C: { shape: 'line', color: '#800000', fillPercentage: 80 },
      D: { shape: 'circle', color: '#FFA500', fillPercentage: 60 },
      E: { shape: 'triangle', color: '#008000', fillPercentage: 50 },
      F: { shape: 'line', color: '#800000', fillPercentage: 10 },
    }
  },
  {
    id: 1,
    matrix: [
      [{ shape: 'circle', color: '#000000', fillPercentage: 0 }, { shape: 'square', color: '#FF0000', fillPercentage: 50 }, { shape: 'triangle', color: '#00FF00', fillPercentage: 75 }],
      [{ shape: 'pentagon', color: '#0000FF', fillPercentage: 25 }, { shape: 'line', color: '#FFFF00', fillPercentage: 100 }, { shape: 'circle', color: '#FF00FF', fillPercentage: 60 }],
      [{ shape: 'triangle', color: '#00FFFF', fillPercentage: 40 }, { shape: 'triangle', color: '#800080', fillPercentage: 90 }, null]
    ],
    correctAnswer: 'B',
    options: {
      A: { shape: 'circle', color: '#FFA500', fillPercentage: 30 },
      B: { shape: 'pentagon', color: '#008000', fillPercentage: 70 },
      C: { shape: 'line', color: '#800000', fillPercentage: 80 },
    }
  },
  // Add more questions here
];

const SVGShapeQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === questions[currentQuestion].correctAnswer);
  };

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion+1);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const prevQuestion = () => {
    setCurrentQuestion(currentQuestion - 1)
    setSelectedAnswer(null);
    setIsCorrect(null);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className={`border-4 rounded-lg p-4 mb-4 ${
        isCorrect === null ? 'border-gray-300' :
        isCorrect ? 'border-green-500 shadow-lg shadow-green-200' :
        'border-red-500 shadow-lg shadow-red-200'
      }`}>
    <h2 className="text-xl font-bold mb-4">Exercise {currentQuestion + 1}</h2>
    <MatrixDisplay matrix={questions[currentQuestion].matrix} />
    {isCorrect !== null && (
        <div className={`flex items-center ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
        {isCorrect ? <CheckCircle className="mr-2" /> : <AlertCircle className="mr-2" />}
        <p>{isCorrect ? 'Correct!' : 'Incorrect. Try again.'}</p>
        </div>
    )}
      </div>
      <h1 className='font-bold text-center'>
            SELECT ANSWER BELOW
        </h1>
        <div className="grid grid-cols-6 gap-4 mt-2">
          {Object.entries(questions[currentQuestion].options).map(([key, cell]) => (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              className={`p-2 border rounded hover:bg-blue-100 ${selectedAnswer === key ? 'bg-blue-200' : ''}`}
            >
              <div className="flex flex-center w-18 h-18">
                <h2 className="absolute font-semibold">{key}</h2>
                <ShapeSVG {...cell} />
              </div>
            </button>
          ))}
      </div>
      {currentQuestion < questions.length-1  && (
        <div className='flex justify-end'>
        <button
            onClick={nextQuestion}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
            Next Question
        </button>
        </div>
      )}
      {currentQuestion != 0  && (
        <div className='flex justify-start'>
        <button
            onClick={prevQuestion}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
            Previous Question
        </button>
        </div>
      )}
    </div>
  );
};

export default SVGShapeQuiz;