'use client'

import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Image, { StaticImageData } from "next/image"
import q1 from '@/images/questions/q1.png'
import q1a from '@/images/questions/q1a.png'
import q1b from '@/images/questions/q1b.png'
import q1c from '@/images/questions/q1c.png'
import q1d from '@/images/questions/q1d.png'
import q1e from '@/images/questions/q1e.png'
import q1f from '@/images/questions/q1f.png'


type Question = {
  id: number;
  image: StaticImageData;
  correctAnswer: string;
  options: { [key: string]: StaticImageData };
};
//  If I want this to be an enum correctAnswer: "A" | "B" | "C" | "D" | "E" | "F";


const questions: Question[] = [
    {
        id: 1,
        image: q1,
        correctAnswer: 'A',
        options: { A: q1a, B: q1b, C: q1c, D:  q1d, E: q1e, F: q1f }
    },    
  // More questions
];

const QuizQuestion = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === questions[currentQuestion].correctAnswer);
  };

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
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
        <h2 className="text-xl font-bold mb-4">Exercise {currentQuestion + 1}</h2>
        <Image src={questions[currentQuestion].image} alt="Question" className="w-full mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(questions[currentQuestion].options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              className={`p-2 border rounded ${selectedAnswer === key ? 'bg-blue-100' : ''}`}
            >
              <Image src={value} alt={`Option ${key}`} className="w-full" />
            </button>
          ))}
        </div>
      </div>
      {isCorrect !== null && (
        <div>
        <div className={`flex items-center ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
          {isCorrect ? <CheckCircle className="mr-2" /> : <AlertCircle className="mr-2" />}
          <p>{isCorrect ? 'Correct!' : 'Incorrect.'}</p>
        </div>
        <div>
        {!isCorrect && (
        <div>
            <h1 className="pt-4 font-semibold">AI EXPLANATION</h1>
            <p className="pt-4">Look at how the black square moves in each row. In the top row, it goes from left to right along the top. In the middle row, it stays in the center but still moves from left to right. For the bottom row, we are seeing the same left-to-right movement, but along the bottom of each grid. We have seen bottom-left and bottom-middle, so the logical next position is bottom-right, which is what option A shows.</p>
        </div>
        )}
        </div>
        </div>
      )}
      {/* <button
        onClick={nextQuestion}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Next Question
      </button> */}
    </div>
  );
};

export default QuizQuestion;