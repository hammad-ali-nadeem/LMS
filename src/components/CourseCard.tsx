import React from 'react';
import { Link } from 'react-router-dom';
import useProgressStore from '../store/useProgressStore';

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  description: string;
  totalLessons: number;
}

interface Props {
  course: Course;
}

const CourseCard: React.FC<Props> = ({ course }) => {
  const progress = useProgressStore((state) => state.progress[course.id] || {});
  const lessonsWatched = progress?.watchedLessons?.length || 0;
  const quizDone = progress?.quizCompleted || false;

  return (
    <Link
      to={`/courses/${course.id}`}
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col"
    >
      <img
        src={course.thumbnail}
        alt={course.title}
        className="h-40 w-full object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
        <p className="text-sm text-gray-500 flex-1">{course.description}</p>

        <div className="mt-3 text-sm font-medium text-blue-600">
          {lessonsWatched}/{course.totalLessons} lessons watched
        </div>

        {quizDone && (
          <div className="mt-1 text-green-600 font-semibold text-sm">
            ✅ Quiz completed
          </div>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
