import React, { useEffect, useState } from 'react';
import { useParams , Link, useNavigate } from 'react-router-dom';
import useProgressStore from '../store/useProgressStore';

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
}

const CourseDetail = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [note, setNote] = useState('');
  const { setLessonWatched } = useProgressStore();
const progress = useProgressStore((state) => state.progress[courseId!] || {});
const navigate = useNavigate();
  useEffect(() => {
    fetch('/data/courses.json')
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((c: any) => c.id === courseId);
        setCourse(found);
      });

    fetch('/data/lessons.json')
      .then((res) => res.json())
      .then((data) => {
        const match = data.find((l: any) => l.courseId === courseId);
        if (match?.lessons) {
          setLessons(match.lessons);
          setSelectedLesson(match.lessons[0]);
        }
      });
  }, [courseId]);

  useEffect(() => {
    if (selectedLesson) {
      const saved = localStorage.getItem(`note-${courseId}-${selectedLesson.id}`);
      setNote(saved || '');
      setLessonWatched(courseId!, selectedLesson.id);
    }
  }, [selectedLesson]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    if (selectedLesson) {
      localStorage.setItem(`note-${courseId}-${selectedLesson.id}`, e.target.value);
    }
  };
  const allWatched = lessons.length > 0 && lessons.every((lesson) =>
  (progress?.watchedLessons || []).includes(lesson.id)
);

  if (!course || !selectedLesson) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
        <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-block px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
        ← Back
        </button>
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.instructor}</p>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ul className="space-y-2">
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`cursor-pointer p-2 rounded ${
                  selectedLesson.id === lesson.id
                    ? 'bg-blue-100 font-semibold'
                    : 'hover:bg-gray-100'
                }`}
              >
                {lesson.title}
              </li>
            ))}
            {allWatched ? (
                <Link
                    to={`/courses/${courseId}/quiz`}
                    className="inline-block mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
                >
                    Take Quiz
                </Link>
                ) : (
                <div className="mt-4 text-gray-500 italic">
                    ✅ Watch all lessons to unlock the quiz.
                </div>
                )}
          </ul>
        </div>

        <div className="md:col-span-3 space-y-4">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
                src={selectedLesson.videoUrl}
                title={selectedLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg shadow"
            ></iframe>
            </div>
          <textarea
            value={note}
            onChange={handleNoteChange}
            placeholder="Write notes here..."
            className="w-full h-40 border rounded p-4"
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
