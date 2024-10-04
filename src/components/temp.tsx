'use client'

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, Plus } from 'lucide-react';
import AdviceModal from '@/components/AdviceModal'
import Anthropic from '@anthropic-ai/sdk';

type Shape = 'line' | 'circle' | 'square' | 'rectangle' | 'triangle' | 'pentagon';
type Color = string;
type FillPercentage = number; // 0 to 100
type Rotation = number; // 0 to 360
type Size = 'smallest' | 'smaller' | 'small' | 'medium' | 'large';
type AreaPosition = 
  'top-left' | 'top-left-center' | 'top-center' | 'top-right-center' | 'top-right' |
  'upper-left' | 'upper-center' | 'upper-right' |
  'middle-left' | 'middle-left-center' | 'center' | 'middle-right-center' | 'middle-right' |
  'lower-left' | 'lower-center' | 'lower-right' |
  'bottom-left' | 'bottom-left-center' | 'bottom-center' | 'bottom-right-center' | 'bottom-right';
  
  interface SVGElementBase {
    shape: Shape;
    color?: Color;
    fillPercentage: FillPercentage;
    rotation?: Rotation;
    size: Size;
  }

    interface WithPosition extends SVGElementBase {
    position: AreaPosition;
    coordinates?: never;  // `never` ensures `coordinates` cannot exist in this case
    }

    interface WithCoordinates extends SVGElementBase {
    coordinates: Coordinates;
    position?: never;  // `never` ensures `position` cannot exist in this case
    }

    type SVGElement = WithPosition | WithCoordinates;

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

type Coordinates = { x: number; y: number };

const ShapeSVG: React.FC<SVGElement> = ({ shape, color='#000000', fillPercentage, rotation=0, size }) => {
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
    case 'rectangle':
        return 'M-40,-20 L40,-20 L40,20 L-40,20 Z';
      default:
        return '';
    }
  };

  const sizeScale = {
    smallest: 0.1,
    smaller: 0.25,
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
      'bottom-right': { x: 33, y: 33 },
      'top-left-center': { x: -22.5, y: -45 },
      'top-right-center': { x: 22.5, y: -45 },
      'upper-left': { x: -45, y: -22.5 },
      'upper-center': { x: 0, y: -22.5 },
      'upper-right': { x: 45, y: -22.5 },
      'middle-left-center': { x: -22.5, y: 0 },
      'middle-right-center': { x: 22.5, y: 0 },
      'lower-left': { x: -45, y: 22.5 },
      'lower-center': { x: 0, y: 22.5 },
      'lower-right': { x: 45, y: 22.5 },
      'bottom-left-center': { x: -22.5, y: 45 },
      'bottom-right-center': { x: 22.5, y: 45 },
    };
    return positionMap[position];
  };

  return (
    <svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg">
      {elements.map((element, index) => {
        const { x, y } = !!element.coordinates ? element.coordinates : getPosition(element.position);
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
        <div className="w-full h-full">
          <CellDisplay cell={cell} />
        </div>
        ) : index === 8 ? (
          <span className="text-4xl font-bold">?</span>
        ) : null}
      </div>
    ))}
  </div>
);

const questionList: Question[] = [
    {
        id: 1,
        matrix: [
          [
            { elements: [{ shape: 'circle', color: '#000000', fillPercentage: 0,  rotation: 0, size: 'large', position: 'center' }] },
            { elements: [{ shape: 'square', color: '#FF0000', fillPercentage: 50,  rotation: 0, size: 'large', position: 'center' }] },
            { elements: [{ shape: 'triangle', color: '#FF00FF', fillPercentage: 100,  rotation: 0, size: 'large', position: 'center' }] }
          ],
          [
            { elements: [{ shape: 'circle', color: '#0000FF', fillPercentage: 50,  rotation: 0, size: 'large', position: 'center' }] },
            { elements: [{ shape: 'square', color: '#FFFF00', fillPercentage: 100,  rotation: 0, size: 'large', position: 'center' }] },
            { elements: [{ shape: 'triangle', color: '#FF00FF', fillPercentage: 0,  rotation: 0, size: 'large', position: 'center' }] }
          ],
          [
            { elements: [{ shape: 'circle', color: '#00FFFF', fillPercentage: 100,  rotation: 0, size: 'large', position: 'center' }] },
            { elements: [{ shape: 'square', color: '#800080', fillPercentage: 0,  rotation: 0, size: 'large', position: 'center'}] },
            null
          ]
        ],
        correctAnswer: 'E',
        options: {
          A: { elements: [{ shape: 'circle', color: '#FFA500', fillPercentage: 30, rotation: 0, size: 'large', position: 'center' }] },
          B: { elements: [{ shape: 'pentagon', color: '#008000', fillPercentage: 70, rotation: 0, size: 'large', position: 'center' }] },
          C: { elements: [{ shape: 'line', color: '#800000', fillPercentage: 80, rotation: 0, size: 'large', position: 'center' }] },
          D: { elements: [{ shape: 'circle', color: '#FFA500', fillPercentage: 60, rotation: 0, size: 'large', position: 'center' }] },
          E: { elements: [{ shape: 'triangle', color: '#008000', fillPercentage: 50, rotation: 0, size: 'large', position: 'center' }] },
          F: { elements: [{ shape: 'line', color: '#800000', fillPercentage: 10, rotation: 0, size: 'large', position: 'center' }] }
        },
        advice: 'Look at how much of each object is filled with color'
      },
  {
    id: 2,
    matrix: [
      [
        { elements: [{ shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'large', position: 'center' }] },
        { elements: [{ shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' }] },
        { elements: [{ shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }] }
      ],
      [
        { elements: [{ shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' }] },
        { elements: [
          { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
          { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'large', position: 'center' },
          { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
          { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
        ] },
        { elements: [{ shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' }] }
      ],
      [
        { elements: [{ shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }] },
        { elements: [{ shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' }] },
        null
      ]
    ],
    correctAnswer: 'C',
    options: {
      A: { elements: [{ shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' }] },
      B: { elements: [{ shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }] },
      C: { elements: [{ shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'large', position: 'center' }] },
      D: { elements: [
        { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
        { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' }
      ] },
      E: { elements: [
        { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'large', position: 'center' },
        { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
      ] },
      F: { elements: [
        { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
        { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'large', position: 'center' },
        { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' }
      ] }
    },
    advice: "Observe the pattern of line rotations in each row and column. Pay attention to how the number of lines changes in different cells."
    }, 
    {
        id: 3,
        matrix: [
          [
            { elements: [
              { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' }
            ] },
            { elements: [
              { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' },
              { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'center' }
            ] },
            { elements: [
              { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'small', position: 'center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'small', position: 'center' }
            ] }
          ],
          [
            { elements: [
              { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'small', position: 'center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'small', position: 'center' }
            ] },
            { elements: [
              { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' }
            ] },
            { elements: [
              { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' },
              { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'center' }
            ] }
          ],
          [
            { elements: [
              { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' },
              { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'center' }
            ] },
            { elements: [
              { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'small', position: 'center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'small', position: 'center' }
            ] },
            null
          ]
        ],
        correctAnswer: 'C',
        options: {
          A: { elements: [
            { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' },
            { shape: 'square', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'center' }
          ] },
          B: { elements: [
            { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' },
            { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'center' }
          ] },
          C: { elements: [
            { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' }
          ] },
          D: { elements: [
            { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' }
          ] },
          E: { elements: [
            { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' }
          ] },
          F: { elements: [
            { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'large', position: 'center' },
            { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'small', position: 'center' },
            { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'small', position: 'center' }
          ] }
        },
        advice: "Observe how the outer shape changes in each row, and how the inner elements (dot, cross, or nothing) follow a pattern across rows and columns."
    },
    
];

const TempTest: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(questionList);
  const [difficulty, setDifficulty] = useState<number>(5);

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
  const generateNewQuestion = async () => {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      console.log('generating question')
      const completion = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 2500,
        system: "You are to respond to any message with a JSON Object that can be parsed without issues. Please make absolute sure that this is the case when you respond.",
        messages: [
          { role: "user", content: `You are an AI designed to generate an JSON object representing a 3x3 matrix puzzle with shapes. The puzzle difficulty ranges from 1-10, as specified by the input variable. Your task is to create a complete JSON object with a matrix, options, correct answer, and advice.First, I will provide you with the difficulty level:<difficulty>${difficulty}</difficulty>Now, follow these steps to generate the JSON object:1. Create a 3x3 matrix where each cell contains 3 objects (triangles, squares, or circles). The objects can be filled or unfilled. The complexity of the pattern should correspond to the given difficulty level. The position should only ever be \"middle-left\", \"center\", or \"middle-right\" and the shape should always be \"smaller\".2. Leave the last cell (bottom-right) of the matrix empty (null).3. Generate 6 potential options (A through F) for the final cell. Make sure only one option is correct and the others are reasonable but incorrect guesses.4. Determine the correct answer (A, B, C, D, E, or F) based on the pattern you\'ve created.5. Write a step-by-step explanation of how to solve the puzzle, which will be used as the \'advice\' field.6. Compile all this information into a JSON object with the following structure: { id: [generate a random number], matrix: [[ { elements: [ { shape: \"triangle\", fillPercentage: 100, position: \"middle-left\", size: \"smaller\" }, { shape: \"square\", fillPercentage: 0, position: \"center\", size: \"smaller\" }, { shape: \"circle\", fillPercentage: 100, position: \"middle-right\", size: \"smaller\" } ] },...],[...],[..., null]], correctAnswer: \"[A-F]\", options: { A: { elements: [ { shape: \"triangle\", fillPercentage: 100, position: \"middle-left\", size: \"smaller\" }, { shape: \"square\", fillPercentage: 0, position: \"center\", size: \"smaller\" }, { shape: \"circle\", fillPercentage: 100, position: \"middle-right\", size: \"smaller\" } ] },...}, advice: \"...\" }Make sure the pattern in the matrix and the options are consistent with the given difficulty level. For lower difficulties (1-3), use simple patterns with minimal variation. For medium difficulties (4-7), introduce more complex patterns or multiple rules. For high difficulties (8-10), create intricate patterns with multiple interacting rules.Think through the puzzle carefully to ensure it has only one correct solution and that no two options are identical. Double-check that the \'advice\' field accurately explains how to arrive at the correct answer. Output your response as a single JSON object, ensuring it\'s properly formatted and contains all required fields. Do not include any explanation or additional text outside the object.There should NEVER be any situation where there are two \"options\" that are identical. Make absolute sure that this is never the case.Also make sure that the \"advice\" field is on one single line or else errors can occur.` }
        ]});
        //console.log('AI response 1 ', completion, completion.content[0].text)
        // @ts-ignore
        const content = completion.content[0].text;
        const parsed = JSON.parse(content)
        //console.log('AI response 2 ', content, parsed, parsed?.matrix, parsed?.matrix[0]);
        const newQuestion: Question = parsed;
        setQuestions([newQuestion]);
        setCurrentQuestion(0);
      } catch (error) {
        alert("Error generating new question: "+error);
        console.log('error ', error);
      }
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
            Hint
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
      <div className='flex justify-between'>
        {currentQuestion !== 0 && (
            <div>
            <button
                onClick={prevQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Previous Question
            </button>
            </div>
        )}
        {currentQuestion < questions.length - 1 && (
            <div className="ml-auto">
            <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Next Question
            </button>
            </div>
        )}
        <button
          onClick={generateNewQuestion}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
        >
          <Plus className="mr-2" size={18} />
          Generate New Question
        </button>
        <div className="w-full sm:w-40">
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium leading-6 text-gray-900">
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            defaultValue={difficulty}
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => setDifficulty(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <option key={level} value={level.toString()}>
                {level}
              </option>
            ))}
          </select>
        </div>
        </div>
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
      <AdviceModal
        information={questions[currentQuestion].advice}
        open={showModal}
        setOpen={setShowModal}
      />
    </div>
  );
};

export default TempTest;