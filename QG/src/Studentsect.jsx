import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "./Header";

function Studentsect() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/see-exams')
      .then(res => {
        console.log("Teachers data:", res.data);
        setTeachers(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Header />
      <div className="p-6 mt-24 max-w-3xl mx-auto">
  <h2 className="text-2xl font-semibold mb-4 text-center">Teachers List</h2>
  {Array.isArray(teachers) && teachers.length > 0 ? (
    <select className="w-full bg-gray-50 p-4 rounded shadow">
      {teachers.map((teacher, index) => (
        <option key={index} value={teacher.username}>
          {teacher.username}
        </option>
      ))}
    </select>
  ) : (
    <p>Loading teachers...</p>
  )}
</div>

    </>
  );
}

export default Studentsect;
