import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CourseProgress {
  watchedLessons: string[];
  quizCompleted?: boolean;
  quizScore?: number;
}

interface ProgressStore {
  progress: Record<string, CourseProgress>;
  setLessonWatched: (courseId: string, lessonId: string) => void;
  completeQuiz: (courseId: string, score: number) => void;
}

const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: {},
      setLessonWatched: (courseId, lessonId) => {
        const course = get().progress[courseId] || { watchedLessons: [] };
        if (!course.watchedLessons.includes(lessonId)) {
          set({
            progress: {
              ...get().progress,
              [courseId]: {
                ...course,
                watchedLessons: [...course.watchedLessons, lessonId],
              },
            },
          });
        }
      },
      completeQuiz: (courseId, score) => {
        const course = get().progress[courseId] || {};
        set({
          progress: {
            ...get().progress,
            [courseId]: {
              ...course,
              quizCompleted: true,
              quizScore: score,
            },
          },
        });
      },
    }),
    { name: 'course-progress' }
  )
);

export default useProgressStore;
