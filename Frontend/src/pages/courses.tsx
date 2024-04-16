import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { CREATE_COURSE } from "../graphql/mutations";
import { GET_COURSES } from "../graphql/queries";
import CourseForm from "./courseForm";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";

const Header: React.FC = () => {
  const router = useRouter();
  console.log(`email`, router.query);
  const goToProfilePage = () => {
    router.push({
      pathname: "/profile",
      query: { email: router.query.email },
    });
  };

  return (
    <nav className="bg-gray-800">
      <Head>
        <link rel="icon" href="/assests/images/odufavicon-new.ico" />
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8"
              src="/assests/images/odulog.png"
              alt="Your Logo"
            />
          </div>
          <div className="md:block">
            <div className="ml-auto flex items-baseline space-x-4">
              <button
                onClick={goToProfilePage}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </button>
              <a
                href="/adminpage"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin
              </a>
              {/* Add more navigation items here */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Courses: React.FC = () => {
  const { data, loading, error } = useQuery(GET_COURSES);
  const [createCourseMutation] = useMutation(CREATE_COURSE);
  const [courseName, setCourseName] = useState("");
  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [prerequisites, setPrerequisites] = useState<
    { id: string; prerequisite: string }[]
  >([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleUpdateClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsAddingNew(false); // Ensure we're not in "adding new" state
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setSelectedCourseId(null); // Ensure no course is selected for editing
  };

  const handleAddPrerequisite = () => {
    const newPrerequisite = { id: uuidv4(), prerequisite: "" };
    setPrerequisites([...prerequisites, newPrerequisite]);
  };

  const handlePrerequisiteChange = (index: number, value: string) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites[index].prerequisite = value;
    setPrerequisites(updatedPrerequisites);
  };

  const handleRemovePrerequisite = (index: number) => {
    const updatedPrerequisites = [...prerequisites];
    updatedPrerequisites.splice(index, 1);
    setPrerequisites(updatedPrerequisites);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const input = {
        courseName,
        level,
        department,
        prerequisites: prerequisites.map(({ prerequisite }) => ({
          id: uuidv4(),
          prerequisites: prerequisite,
        })),
      };
      const response = await createCourseMutation({ variables: { input } });
      if (response.data.createCourse == "Course created successfully") {
        setPopupMessage("Course created successfully");
      } else if (response.data.createCourse == "Course already exists") {
        setPopupMessage("Course already exists");
      } else {
        setPopupMessage("Error creating course. contact the department");
      }
      // Reset form or give feedback
    } catch (error) {
      console.error("Error creating course:", error);
      // Handle error appropriately
    }
  };

  const filteredCourses = React.useMemo(() => {
    if (!data) return [];
    let filtered = [...data.getCourses].sort(
      (a, b) => parseInt(a.level) - parseInt(b.level)
    );
    if (selectedLevel !== null) {
      const lowerBound = selectedLevel * 100;
      const upperBound = lowerBound + 99;
      filtered = filtered.filter(
        (course) =>
          parseInt(course.level) >= lowerBound &&
          parseInt(course.level) <= upperBound
      );
    }
    return filtered;
  }, [data, selectedLevel]);

  const handleLevelFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(parseInt(e.target.value) || null);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="overflow-x-auto">
      <button
        onClick={handleAddNewClick}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Add New Course
      </button>
      <div className="mb-4">
        <label
          htmlFor="levelFilter"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Filter by Level
        </label>
        <select
          id="levelFilter"
          value={selectedLevel || ""}
          onChange={handleLevelFilterChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">All levels</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
            <option key={level} value={level}>
              Level {level}00 - {level}99
            </option>
          ))}
        </select>
      </div>
      {isAddingNew && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div>
            <label
              htmlFor="courseName"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="level"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Level
            </label>
            <input
              type="text"
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="department"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Department
            </label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="prerequisites"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Prerequisites
            </label>
            {prerequisites.map(({ id, prerequisite }, index) => (
              <div key={id} className="flex mb-2">
                <select
                  value={prerequisite}
                  onChange={(e) =>
                    handlePrerequisiteChange(index, e.target.value)
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Select a course</option>
                  {data?.getCourses.map((course: any) => (
                    <option key={course.id} value={course.courseName}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRemovePrerequisite(index)}
                  className="ml-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-10 h-10 p-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPrerequisite}
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
            >
              Add Prerequisite
            </button>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Create Course
          </button>
        </form>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Courses
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Level
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Department
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Prerequisites
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCourses.map((course: any) => (
            <tr key={course.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {course.courseName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{course.level}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {course.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {course.prerequisites.map((p: any, index: number) => (
                  <div key={index}>{p.prerequisites}</div>
                ))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleUpdateClick(course.id)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCourseId && (
        <div className="flex-none w-1/3 p-4">
          <CourseForm courseId={selectedCourseId} />
        </div>
      )}
      {popupMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <p>{popupMessage}</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setPopupMessage("")}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PageComponent: React.FC = () => {
  return (
    <div>
      <Header />
      <Courses />
      {/* Rest of your page content */}
    </div>
  );
};

export default PageComponent;
