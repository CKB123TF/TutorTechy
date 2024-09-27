'use client'

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import AdviceModal from '@/components/AdviceModal'

type Shape = 'line' | 'circle' | 'square' | 'triangle' | 'pentagon';
type Color = string;
type FillPercentage = number; // 0 to 100
type Rotation = number; // 0 to 360
type Size = 'small' | 'medium' | 'large';
type AreaPosition = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface SVGElement {
  shape: Shape;
  color: Color;
  fillPercentage: FillPercentage;
  rotation: Rotation;
  size: Size;
  position: AreaPosition;
}

interface Cell {
  elements: SVGElement[];
}

interface Question {
  id: number;
  matrix: (Cell | null)[][];
  correctAnswer: string;
  options: { [key: string]: Cell };
  advice: string;
}

const ShapeSVG: React.FC<SVGElement> = ({ shape, color, fillPercentage, rotation, size }) => {
  const getPath = (shape: Shape): string => {
    switch (shape) {
      case 'line':
        return 'M-40,0 L40,0';
      case 'circle':
        return 'M0,0 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0';
      case 'square':
        return 'M-40,-40 L40,-40 L40,40 L-40,40 Z';
      case 'triangle':
        return 'M0,-40 L40,40 L-40,40 Z';
      case 'pentagon':
        return 'M0,-40 L38,-12 L23,40 L-23,40 L-38,-12 Z';
      default:
        return '';
    }
  };

  const sizeScale = {
    small: 0.5,
    medium: 0.75,
    large: 1
  };

  return (
    <g transform={`rotate(${rotation}) scale(${sizeScale[size]})`}>
      <defs>
        <linearGradient id={`grad-${shape}-${color}-${fillPercentage}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} />
          <stop offset={`${fillPercentage}%`} stopColor={color} />
          <stop offset={`${fillPercentage}%`} stopColor="transparent" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d={getPath(shape)}
        fill={`url(#grad-${shape}-${color}-${fillPercentage})`}
        stroke={color}
        strokeWidth="4"
      />
    </g>
  );
};

const CellDisplay: React.FC<{ cell: Cell }> = ({ cell }) => {
  const { elements } = cell;

  const getPosition = (position: AreaPosition): { x: number; y: number } => {
    const positionMap = {
      'top-left': { x: -33, y: -33 },
      'top-center': { x: 0, y: -33 },
      'top-right': { x: 33, y: -33 },
      'middle-left': { x: -33, y: 0 },
      'center': { x: 0, y: 0 },
      'middle-right': { x: 33, y: 0 },
      'bottom-left': { x: -33, y: 33 },
      'bottom-center': { x: 0, y: 33 },
      'bottom-right': { x: 33, y: 33 }
    };
    return positionMap[position];
  };

  return (
    <svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg">
      {elements.map((element, index) => {
        const { x, y } = getPosition(element.position);
        return (
          <g key={index} transform={`translate(${x}, ${y})`}>
            <ShapeSVG {...element} />
          </g>
        );
      })}
    </svg>
  );
};

const MatrixDisplay: React.FC<{ matrix: (Cell | null)[][] }> = ({ matrix }) => (
  <div className="grid grid-cols-3 gap-1 w-60 h-60 w-full h-full">
    {matrix.flat().map((cell, index) => (
      <div key={index} className="border flex items-center justify-center aspect-square">
        {cell ? (
          <CellDisplay cell={cell} />
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
      [
        { elements: [{ shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' }] },
        { elements: [{ shape: 'square', color: '#FF0000', fillPercentage: 50, rotation: 45, size: 'medium', position: 'top-right' }] },
        { elements: [{ shape: 'triangle', color: '#00FF00', fillPercentage: 100, rotation: 0, size: 'small', position: 'bottom-left' }] }
      ],
      [
        { elements: [
          { shape: 'circle', color: '#0000FF', fillPercentage: 50, rotation: 0, size: 'small', position: 'top-left' },
          { shape: 'square', color: '#FFFF00', fillPercentage: 25, rotation: 0, size: 'small', position: 'bottom-right' }
        ] },
        { elements: [
          { shape: 'line', color: '#FF00FF', fillPercentage: 100, rotation: 0, size: 'medium', position: 'center' },
          { shape: 'line', color: '#00FFFF', fillPercentage: 100, rotation: 90, size: 'medium', position: 'center' }
        ] },
        { elements: [{ shape: 'pentagon', color: '#800080', fillPercentage: 75, rotation: 72, size: 'large', position: 'center' }] }
      ],
      [
        { elements: [
          { shape: 'circle', color: '#FFA500', fillPercentage: 100, rotation: 0, size: 'medium', position: 'top-center' },
          { shape: 'triangle', color: '#008000', fillPercentage: 50, rotation: 180, size: 'medium', position: 'bottom-center' }
        ] },
        { elements: [{ shape: 'square', color: '#800000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' }] },
        null
      ]
    ],
    correctAnswer: 'E',
    options: {
      A: { elements: [{ shape: 'circle', color: '#FFA500', fillPercentage: 30, rotation: 0, size: 'medium', position: 'center' }] },
      B: { elements: [{ shape: 'pentagon', color: '#008000', fillPercentage: 70, rotation: 0, size: 'large', position: 'center' }] },
      C: { elements: [{ shape: 'line', color: '#800000', fillPercentage: 80, rotation: 45, size: 'large', position: 'center' }] },
      D: { elements: [{ shape: 'circle', color: '#FFA500', fillPercentage: 60, rotation: 0, size: 'small', position: 'top-left' }] },
      E: { elements: [
        { shape: 'triangle', color: '#008000', fillPercentage: 50, rotation: 0, size: 'medium', position: 'top-left' },
        { shape: 'square', color: '#800000', fillPercentage: 25, rotation: 45, size: 'small', position: 'bottom-right' }
      ] },
      F: { elements: [
        { shape: 'line', color: '#800000', fillPercentage: 10, rotation: 0, size: 'small', position: 'top-center' },
        { shape: 'line', color: '#FFA500', fillPercentage: 10, rotation: 90, size: 'small', position: 'bottom-center' }
      ] },
    },
    advice: "Look for patterns in how shapes and colors are distributed across the matrix. Pay attention to how elements combine in each cell."
  },
  // Add more questions here
];

const SVGShapeQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === questions[currentQuestion].correctAnswer);
  };

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const prevQuestion = () => {
    setCurrentQuestion(currentQuestion - 1);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className={`border-4 rounded-lg p-4 mb-4 ${
        isCorrect === null ? 'border-gray-300' :
        isCorrect ? 'border-green-500 shadow-lg shadow-green-200' :
        'border-red-500 shadow-lg shadow-red-200'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Exercise {currentQuestion + 1}</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Info className="mr-1" size={18} />
            Information
          </button>
        </div>
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
      <div className="grid grid-cols-3 gap-4 mt-2">
        {Object.entries(questions[currentQuestion].options).map(([key, cell]) => (
          <button
            key={key}
            onClick={() => handleAnswer(key)}
            className={`p-2 border rounded hover:bg-blue-100 ${selectedAnswer === key ? 'bg-blue-200' : ''}`}
          >
            <div className="flex flex-col items-center justify-center w-full aspect-square">
              <h2 className="font-semibold mb-1">{key}</h2>
              <div className="w-full h-full">
                <CellDisplay cell={cell} />
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className='flex justify-between mt-4'>
        {currentQuestion !== 0 && (
          <button
            onClick={prevQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Previous Question
          </button>
        )}
        {currentQuestion < questions.length - 1 && (
          <button
            onClick={nextQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next Question
          </button>
        )}
      </div>
      <AdviceModal
        information={questions[currentQuestion].advice}
        open={showModal}
        setOpen={setShowModal}
      />
    </div>
  );
};

export default SVGShapeQuiz;