import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  category: string;
  description: string;
}

const CourseCatalog = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/courses.json')
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setFilteredCourses(data);
      });
  }, []);

  useEffect(() => {
    let filtered = [...courses];

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          c.instructor.toLowerCase().includes(term)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((c) => c.category === selectedCategory);
    }

    setFilteredCourses(filtered);
  }, [search, selectedCategory, courses]);

  const categories = Array.from(new Set(courses.map((c) => c.category)));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or instructor..."
          className="w-full md:w-1/2 border px-4 py-2 rounded shadow-sm"
        />

        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory((prev) => (prev === cat ? null : cat))
              }
              className={`px-3 py-1 rounded-full border text-sm ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
};

export default CourseCatalog;
