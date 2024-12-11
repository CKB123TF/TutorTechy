'use client'

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, Plus, Loader } from 'lucide-react';
import AdviceModal from '@/components/AdviceModal'
import Anthropic from '@anthropic-ai/sdk';type Shape = 'line' | 'circle' | 'square' | 'rectangle' | 'triangle' | 'pentagon';
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

type Coordinates = { x: number; y: number };


interface Question {
    id: number;
    matrix: (Cell | null)[][];
    correctAnswer: string;
    options: { [key: string]: Cell & { type?: string } };
    advice: string;
    difficulty: number;
    type: string;
  }

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
          const coordinates = element.coordinates || getPosition(element.position);
          const { x = 0, y = 0 } = coordinates || {};
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

  const randomDifficulty = Math.floor(Math.random() * 10) + 1;
  const randLetter = String.fromCharCode(Math.floor(Math.random() * 6) + 65); // Generates A-F

  const prompt = `
  You are an AI specialized in creating complex matrix reasoning questions for cognitive assessments. Your task is to generate a challenging and unique 3x3 matrix puzzle that tests visual pattern recognition skills. 

  First, let's establish the parameters for this puzzle:

  difficulty: ${randomDifficulty}
  letter: ${randLetter}

  Now, follow these steps to create a valid and logically consistent matrix reasoning question:
  
  1. Matrix Structure:
  - Generate a 3x3 matrix.
  - Each cell must contain an 'elements' array with MatrixElement objects.
  - Create multiple patterns using diagonals, rows, and columns.
  - Ensure the matrix challenges users with creative combinations of positions, rotations, colors, and number of shapes.

  2. Shape Properties:
  - Use only these shapes (case sensitive, lowercase): circle, square, pentagon, line, triangle.
  - Set all shapes to size 0.3.
  - Avoid overlapping shapes in the same Position.
  - Use only Position values (x,y) of 0, 1, or 2.
  - Use only lowercase, valid SwiftUI Color values.
  - Do not apply rotation to circles.
  - Only apply a rotation of either 0 or 45 degrees to squares.
  - Set FillPercentage between 0-100.
  - Set Rotation between 0-360 (except for circles).
  - Do not have shapes overlap. No two shapes should have the same Position values in the same cell.

  3. Answer Options:
  - Create one unique correct answer and several incorrect options.

  4. JSON Structure:
  Your final output must be valid, parseable JSON with no leading/trailing text or backslashes. Use this structure:

  {
      id: 1,
      "matrix": [
      [
          { elements: [{ shape: 'circle', color: '#000000', fillPercentage: 0,  rotation: 0, size: 'large', position: 'center' }] },
          {...},
          {...}
      ],
      [
          {...},
          {...},
          {...}
      ],
      [
          {...},
          {...},
          null
      ]
      ],
      "correctAnswer": "F",
      "options": {
      "A": {
          "elements": [...],
      },
      // B through F
      },
      "advice": "Look for patterns in rotation and color changes",
      "difficulty": 1,
      "type": "pattern recognition"
  }

  5. Validation:
  - Ensure all JSON fields are present and non-null (except for the bottom-right matrix cell, which should be null).
  - Verify that the matrix is exactly 3x3.
  - Double-check that all position coordinates, colors, shapes, and other properties are valid according to the constraints.

  6. Advice:
  - Provide specific advice about the patterns and logic in the question. The schema for advice is "pattern 1 is across every row and has the square move left to right... Pattern 2... Pattern X... Therefore F is the correct answer because... and A is incorrect because the square is rotated incorrectly and the circle is green instead of red... B is wrong because... C is wrong because..." //Make sure that the correct answer is a random value between A-F

  a. Define the primary pattern(s) for each row, column, and diagonal. 
  b. List out the specific attributes (shape, color, rotation, etc.) that change in each pattern. Make sure to think about whether a visible change is occurring (e.g. a circle being rotated is not a visible change, but a color change is).
  c. Describe how these patterns interact or combine to create the final matrix. Save this output and place it directly into the "advice" field of the JSON.
  d. Plan out the contents of each cell, ensuring consistency.
  e. Remove one of the cells from the matrix and remember and set it as letter ${randLetter} among the options. 
  f. Plan out 5 incorrect options that break one of the patterns and make sure that it isn't visually the same as the correct option. Remember these options and have them be the incorrect alternative options along with the explanations of why they are wrong.

  Then, review your plan to confirm that the logic is sound and there are no contradictions or unintended patterns.

  After your design process, generate the final JSON output without any additional text or explanations.
  `;

  const initialQuestions: Question[] = [
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
            { elements: [{ shape: 'square', color: '#800080', fillPercentage: 0,  rotation: 0, size: 'large', position: 'center' }] },
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
        advice: 'Look at how much of each object is filled with color',
        difficulty: 1,
        type: 'pattern recognition'
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
    advice: "Observe the pattern of line rotations in each row and column. Pay attention to how the number of lines changes in different cells.",
    difficulty: 1,
    type: 'pattern recognition'
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
        advice: "Observe how the outer shape changes in each row, and how the inner elements (dot, cross, or nothing) follow a pattern across rows and columns.",
        difficulty: 1,
        type: 'pattern recognition'
    },
    {
        id: 4,
        matrix: [
          [
            { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
              { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' }
            ] },
            { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
              { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'center' }
            ] },
            { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
              { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' }
            ] }
          ],
          [
            { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'large', position: 'center' },
              { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 45, size: 'smaller', position: 'top-left' }
            ] },
            { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'large', position: 'center' },
              { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 45, size: 'smaller', position: 'center' }
            ] },
            { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'large', position: 'center' },
              { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 45, size: 'smaller', position: 'bottom-right' }
            ] }
          ],
          [
            { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
              { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 90, size: 'smaller', position: 'top-center' }
            ] },
            { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
              { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 90, size: 'smaller', position: 'center' }
            ] },
            null
          ]
        ],
        correctAnswer: 'C',
        options: {
          A: { elements: [
            { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
            { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 90, size: 'smaller', position: 'top-center' }
          ] },
          B: { elements: [
            { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
            { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 90, size: 'smaller', position: 'center' }
          ] },
          C: { elements: [
            { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
            { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 90, size: 'smaller', position: 'bottom-center' }
          ] },
          D: { elements: [
            { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
            { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' }
          ] },
          E: { elements: [
            { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'large', position: 'center' },
            { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 45, size: 'smaller', position: 'bottom-right' }
          ] },
          F: { elements: [
            { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' },
            { shape: 'rectangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', position: 'top-left' }
          ] }
        },
        advice: "Observe the pattern of line rotations in each row and how the position of the rectangle changes along the line from left to right in each row.",
        difficulty: 1,
        type: 'pattern recognition'
      },
        {
          id: 5,
          matrix: [
            [
              { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'top-left' },
                { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-right' }
              ] },
              { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'top-left' },
                { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-right' }
              ] },
              { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'top-left' },
                { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-left' }
              ] }
            ],
            [
              { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'bottom-left' },
                { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-right' }
              ] },
              { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'bottom-left' },
                { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-right' }
              ] },
              { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'bottom-left' },
                { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-left' }
              ] }
            ],
            [
              { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'bottom-right' },
                { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-right' }
              ] },
              { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'bottom-right' },
                { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-right' }
              ] },
              null
            ]
          ],
          correctAnswer: 'C',
          options: {
            A: { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
              { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'top-left' },
              { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-right' }
            ] },
            B: { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
              { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'bottom-left' },
              { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-right' }
            ] },
            C: { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
              { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'bottom-right' },
              { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-left' }
            ] },
            D: { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
              { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'center' },
              { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'center' }
            ] },
            E: { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
              { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smallest', position: 'top-right' },
              { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-left' }
            ] },
            F: { elements: [
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'top-center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-left' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-right' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'bottom-center' },
              { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'center' }
            ] }
          },
            advice: "Observe the pattern of the circle and square positions in each cell. Notice how they move relative to each other and the cross shape across rows and columns.",
            difficulty: 1,
            type: 'pattern recognition'
        },
        {
            id: 6,
            matrix: [
                [
                { elements: [
                    { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] },
                { elements: [
                    { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' }
                ] },
                { elements: [
                    { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' }
                ] }
                ],
                [
                { elements: [
                    { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' }
                ] },
                { elements: [
                    { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' }
                ] },
                { elements: [
                    { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] }
                ],
                [
                { elements: [
                    { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' }
                ] },
                { elements: [
                    { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] },
                null
                ]
            ],
            correctAnswer: 'E',
            options: {
                A: { elements: [
                { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] },
                B: { elements: [
                { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' }
                ] },
                C: { elements: [
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'large', position: 'center' }
                ] },
                D: { elements: [
                { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' }
                ] },
                E: { elements: [
                { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'large', position: 'center' }
                ] },
                F: { elements: [
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'medium', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' }
                ] }
            },
            advice: "Pay attention to the pattern of shapes and the orientation of the lines within them. Notice how they change across rows and columns.",
            difficulty: 1,
            type: 'pattern recognition'
        }, 
        {
            id: 7,
            matrix: [
              [
                { elements: [
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 135, size: 'smaller', coordinates: {x: 28, y: -15}},
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: -45, size: 'smaller', coordinates: {x: -30,  y: 18}},
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] },
                { elements: [
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 135, size: 'smaller', coordinates: {x: -16,  y: 28} },
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: -45, size: 'smaller', coordinates: {x: 15,  y: -28} },
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 135, size: 'smaller', coordinates: {x: 28, y: -15}},
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] },
                { elements: [
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: 28, y: -15} },
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: -45, size: 'smaller', coordinates: {x: 15,  y: -28}},
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: -45, size: 'smaller', coordinates: {x: -30,  y: 16}},
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: -16,  y: 30}}, 
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] }
              ],
              [
                { elements: [
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: 28, y: -15} },
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 135, size: 'smaller', coordinates: {x: -16,  y: 28} },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] },
                { elements: [
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: -45, size: 'smaller', coordinates: {x: -30,  y: 14} },
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: 28, y: -15} },
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: -16,  y: 28} },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] },
                { elements: [
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: -45, size: 'smaller', coordinates: {x: 15,  y: -28} },
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: -45, size: 'smaller', coordinates: {x: -28,  y: 16} },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] }
              ],
              [
                { elements: [
                    { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: -45, size: 'smaller', coordinates: {x: -28,  y: 16} },
                    { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: 28, y: -15} },
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] },
                { elements: [
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: -45, size: 'smaller', coordinates: {x: 15,  y: -28} },
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: -16,  y: 28} },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
                ] },
                null
              ]
            ],
            correctAnswer: 'E',
            options: {
              A:  { elements: [
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: -45, size: 'smaller', coordinates: {x: 15,  y: -28} },
                { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: -16,  y: 28} },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
              ] },
              B:  { elements: [
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 135, size: 'smaller', coordinates: {x: 28, y: -15} },
                { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: -45, size: 'smaller', coordinates: {x: 15,  y: -28}},
                { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: -45, size: 'smaller', coordinates: {x: -30,  y: 16}},
                { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: -16,  y: 30}}, 
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
              ] },
              C: { elements: [
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 135, size: 'smaller', coordinates: {x: -16,  y: 28} },
                { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: -45, size: 'smaller', coordinates: {x: 15,  y: -28} },
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 135, size: 'smaller', coordinates: {x: 28, y: -15}},
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
              ] },
              D: { elements: [
                { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: -45, size: 'smaller', coordinates: {x: -30,  y: 14} },
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 135, size: 'smaller', coordinates: {x: 28, y: -15} },
                { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: -16,  y: 28} },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
              ] },
              E: { elements: [
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: -45, size: 'smaller', coordinates: {x: -28,  y: 14} },
                { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: 28, y: -15} },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
              ] },
              F: { elements: [
                { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 135, size: 'smaller', coordinates: {x: 28, y: -15} },
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 135, size: 'smaller', coordinates: {x: -16,  y: 28} },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'large', position: 'center' }
              ] }
            },
            advice: "Pay attention to the sideways upper-right to bottom-left area and see if you can find the pattern there.",
            difficulty: 1,
            type: 'pattern recognition'
          },
          {
            id: 8,
            matrix: [
              [
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-left' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-right' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'bottom-center' }
                ] },
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'top-center' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'bottom-center' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'medium', position: 'center' }
                ] },
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'top-center' },                  
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-left' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-right' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'medium', position: 'center' }                                  
                ] }
              ],
              [
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'bottom-center' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-right' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'top-center' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'medium', position: 'center' }                                  
                ] },
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'top-center' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-right' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'center' }
                ] },
                { elements: [
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'bottom-center' },
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'center' },
                    { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'medium', position: 'center' }
                ] }
              ],
              [
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-left' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'top-center' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'medium', position: 'center' }
                ] },
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-right' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'bottom-center' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'center' },
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'medium', position: 'center' }
                ] },
                null
              ]
            ],
            correctAnswer: 'F',
            options: {
              A:                 { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-left' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'bottom-center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 135, size: 'medium', position: 'center' }
              ] },
              B: { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'middle-left' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'middle-right' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'top-center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'bottom-center' }
              ] },
              C: { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'top-left' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'bottom-right' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: -45, size: 'medium', position: 'top-right' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: -45, size: 'medium', position: 'bottom-left' }
              ] },
              D: { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'top-left' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'top-right' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'bottom-left' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'bottom-right' }
              ] },
              E: { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'top-center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'bottom-center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-left' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-right' }
              ] },
              F: { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'top-center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-left' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'medium', position: 'middle-right' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 0, size: 'medium', position: 'bottom-center' },
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 45, size: 'medium', position: 'center' },
              ] }
            },
            advice: "Addition and Subtraction are always useful tools",
            difficulty: 1,
            type: 'pattern recognition'
          },
          {
            id: 9,
            matrix: [
              [
                { elements: [
                  { shape: 'square', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'center' },
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-right' }
                ] },
                { elements: [
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                  { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'center' },
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' }
                ] },
                { elements: [
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-left' },
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'center' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' }
                ] }
              ],
              [
                { elements: [
                  { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-left' },
                  { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'center' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' }
                ] },
                { elements: [
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-left' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'center' },
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-right' }
                ] },
                { elements: [
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'center' },
                  { shape: 'square', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' }
                ] }
              ],
              [
                { elements: [
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'center' },
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-right' }
                ] },
                { elements: [
                  { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-left' },
                  { shape: 'square', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'center' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' }
                ] },
                null
              ]
            ],
            correctAnswer: 'A',
            options: {
              A: { elements: [
                { shape: 'triangle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'center' },
                { shape: 'square', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-right' }
              ] },
              B: { elements: [
                { shape: 'square', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' }
              ] },
              C: { elements: [
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                { shape: 'square', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'center' },
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-right' }
              ] },
              D: { elements: [
                { shape: 'square', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'center' },
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-right' }
              ] },
              E: { elements: [
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-left' },
                { shape: 'triangle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'center' },
                { shape: 'square', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' }
              ] },
              F: { elements: [
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                { shape: 'square', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' }
              ] }
            },
            advice: "Sometimes there can be multiple patterns, some going vertically while others are going sideways",
            difficulty: 1,
            type: 'pattern recognition'
          },
          {
            id: 10,
            matrix: [
              [
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-left' }
                ] },
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'middle-right' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-right' }
                ] },
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-left' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-right' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'bottom-left' },
                ] }
              ],
              [
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-left' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-right' }
                ] },
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-right' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'bottom-left' }
                ] },
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-left' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' }
                ] }
              ],
              [
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'bottom-left' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-right' }
                ] },
                { elements: [
                  { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-left' },
                  { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-right' },
                  { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' }
                ] },
                null
              ]
            ],
            correctAnswer: 'A',
            options: {
              A: { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-left' }
              ] },
              B: { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-left' },
                { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-right' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' }
              ] },
              C: { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-left' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'bottom-left' },
                { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-right' }
              ] },
              D: { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'bottom-left' },
              ] },
              E: { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-left' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-left' },
                { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'top-right' }
              ] },
              F: { elements: [
                { shape: 'line', color: '#000000', fillPercentage: 100, rotation: 90, size: 'large', position: 'center' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'top-left' },
                { shape: 'circle', color: '#000000', fillPercentage: 100, rotation: 0, size: 'smaller', position: 'middle-right' },
                { shape: 'circle', color: '#000000', fillPercentage: 0, rotation: 0, size: 'smaller', position: 'bottom-left' }
              ] }
            },
            advice: "Snakes are an interesting animal, I like the way that they slither and hide beneath things",
            difficulty: 1,
            type: 'pattern recognition'
          }]

          const TempTest: React.FC = () => {
            const [currentQuestion, setCurrentQuestion] = useState(0);
            const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
            const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
            const [showModal, setShowModal] = useState(false);
            const [questions, setQuestions] = useState<Question[]>(initialQuestions);
            const [difficulty, setDifficulty] = useState<number>(5);
            const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
            const [showScoreScreen, setShowScoreScreen] = useState(false);
            const [isLoading, setIsLoading] = useState(false);
          
            const handleAnswer = (answer: string) => {
              setSelectedAnswer(answer);
              const correct = answer === questions[currentQuestion].correctAnswer;
              setIsCorrect(correct);
              const newUserAnswers = [...userAnswers];
              newUserAnswers[currentQuestion] = answer;
              setUserAnswers(newUserAnswers);
            };
          
            const nextQuestion = () => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
                setIsCorrect(null);
              } else {
                setShowScoreScreen(true);
              }
            };
          
            const prevQuestion = () => {
              setCurrentQuestion(currentQuestion - 1);
              setSelectedAnswer(null);
              setIsCorrect(null);
            };
          
            const generateNewQuestion = async () => {
              setIsLoading(true);
              const anthropic = new Anthropic({
                apiKey: process.env.ANTHROPIC_API_KEY,
                dangerouslyAllowBrowser: true,
              });
          
              try {
                console.log('generating question')
                const completion = await anthropic.messages.create({
                 model: "claude-3-5-sonnet-20241022",
                  max_tokens: 5000,
                  messages: [
                    { role: "user", content: prompt }
                  ]});
                // @ts-ignore
                const content = completion.content[0].text;
                const parsed = JSON.parse(content)
                const newQuestion: Question = parsed;
                setQuestions([newQuestion]);
                setCurrentQuestion(0);
                setUserAnswers([]);
                setShowScoreScreen(false);
              } catch (error) {
                alert("Error generating new question: "+error);
                console.log('error ', error);
              } finally {
                setIsLoading(false);
              }
            };
          
            const ScoreScreen: React.FC = () => {
              const score = userAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
              
              return (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
                  <p className="text-xl mb-4">Your score: {score} out of {questions.length}</p>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Question Summary:</h3>
                    {questions.map((question, index) => (
                      <div key={index} className="mb-2">
                        <p>Question {index + 1}: {userAnswers[index] === question.correctAnswer ? 'Correct' : 'Incorrect'}</p>
                        <p>Difficulty: {question.difficulty}</p>
                        <p>Type: {question.type}</p>
                        {userAnswers[index] !== question.correctAnswer && (
                          <p>Incorrect Option Type: {question.options[userAnswers[index] as string]?.type}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={generateNewQuestion}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center mx-auto disabled:bg-green-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="animate-spin mr-2" size={18} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2" size={18} />
                        Generate New AI Question
                      </>
                    )}
                  </button>
                </div>
              );
            };
          
            return (
              <div className="max-w-2xl mx-auto p-4">
                {!showScoreScreen ? (
                  <>
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
                      {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-[400px] w-full">
                          <Loader className="animate-spin h-12 w-12 text-blue-500" />
                          <p className="mt-4 text-gray-600">Generating new question...</p>
                        </div>
                      ) : (
                        <MatrixDisplay matrix={questions[currentQuestion].matrix} />
                      )}
                    </div>
                    <div className='flex justify-between'>
                      {currentQuestion !== 0 && (
                        <button
                          onClick={prevQuestion}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Previous Question
                        </button>
                      )}
                      {currentQuestion < questions.length - 1 ? (
                        <button
                          onClick={nextQuestion}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowScoreScreen(true)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                    <h1 className='font-bold text-center mt-4'>
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
                  </>
                ) : (
                  <ScoreScreen />
                )}
              </div>
            );
          };
          
          export default TempTest;