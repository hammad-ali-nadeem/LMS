import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import useProgressStore from '../store/useProgressStore';

const QuizPage = () => {
  const { id: courseId } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
const navigate = useNavigate();
  const completeQuiz = useProgressStore((state) => state.completeQuiz);

  useEffect(() => {
    fetch('/src/data/quizzes.json')
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((q: any) => q.courseId === courseId);
        if (match?.questions) setQuestions(match.questions);
      });
  }, [courseId]);

  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    completeQuiz(courseId!, score);
    setSubmitted(true);
  };

  if (!questions.length) return <p className="p-6">Loading quiz...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
        <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-block px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
        ← Back
        </button>
        <h1 className="text-2xl font-bold">Quiz</h1>    
      {!submitted ? (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Question {current + 1} of {questions.length}
          </h2>
          <p className="mb-4">{questions[current].question}</p>
          <div className="space-y-2 mb-4">
            {questions[current].options.map((option: string) => (
              <label key={option} className="block">
                <input
                  type="radio"
                  name={`q-${current}`}
                  value={option}
                  checked={answers[current] === option}
                  onChange={() => setAnswers({ ...answers, [current]: option })}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => setCurrent(current - 1)}
              disabled={current === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {current === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={() => setCurrent(current + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Quiz Results</h2>
          <p className="mb-4">
            Score:{" "}
            {
              questions.filter((q, i) => answers[i] === q.correctAnswer)
                .length
            }{" "}
            / {questions.length}
          </p>
          {questions.map((q, i) => (
            <div key={i} className="mb-4">
              <p className="font-medium">{q.question}</p>
              <p>Your answer: {answers[i]}</p>
              <p className="text-green-600">
                Correct answer: {q.correctAnswer}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default QuizPage;
