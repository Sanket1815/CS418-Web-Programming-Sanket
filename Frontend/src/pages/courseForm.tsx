import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_COURSE, REMOVE_PREREQUISITE } from "../graphql/mutations";
import { GET_COURSES, GET_COURSE } from "../graphql/queries";
import { v4 as uuidv4 } from "uuid";
import Header from "./header";

const UpdateCoursePage: React.FC<{ courseId?: string | null }> = ({
  courseId,
}) => {
  const [prerequisites, setPrerequisites] = useState<
    { id: string; courseName: string; level: string }[]
  >([]);
  const [updateCourseMutation] = useMutation(UPDATE_COURSE);
  const [removePrerequisiteMutation] = useMutation(REMOVE_PREREQUISITE);
  const [popupMessage, setPopupMessage] = useState("");
  const { data: coursesData, loading: coursesLoading } = useQuery(GET_COURSES);
  const { data: courseData, loading: courseLoading } = useQuery(GET_COURSE, {
    variables: { input: { id: courseId } },
    skip: !courseId,
  });

  useEffect(() => {
    if (courseData?.getCourse?.prerequisites) {
      const initialPrerequisites = courseData.getCourse.prerequisites.map(
        (prereq: any) => ({
          id: prereq.id,
          courseName: prereq.prerequisites,
          level: prereq.level,
        })
      );
      setPrerequisites(initialPrerequisites);
    }
  }, [courseData]);

  if (coursesLoading || courseLoading) return <p>Loading...</p>;
  if (!coursesData || !courseData) return <p>No course data available</p>;

  const handleAddPrerequisite = () => {
    setPrerequisites([
      ...prerequisites,
      { id: uuidv4(), courseName: "", level: "" },
    ]);
  };

  // const handleLevelChange = (id: string, level: string) => {
  //   const updatedPrerequisites = [...prerequisites];
  //   updatedPrerequisites[index].level = level;
  //   setPrerequisites(updatedPrerequisites);
  // };
  const handleLevelChange = (id: string, level: string) => {
    setPrerequisites(
      prerequisites.map((prerequisite) =>
        prerequisite.id === id ? { ...prerequisite, level } : prerequisite
      )
    );
  };

  // const handleCourseChange = (index: number, courseName: string) => {
  //   const updatedPrerequisites = [...prerequisites];
  //   updatedPrerequisites[index].courseName = courseName;
  //   setPrerequisites(updatedPrerequisites);
  // };
  const handleCourseChange = (id: string, courseName: string) => {
    setPrerequisites(
      prerequisites.map((prerequisite) =>
        prerequisite.id === id ? { ...prerequisite, courseName } : prerequisite
      )
    );
  };

  const handleRemovePrerequisite = async (prerequisiteId: string) => {
    try {
      console.log(`remove1`, prerequisiteId);
      const result = await removePrerequisiteMutation({
        variables: {
          input: { id: prerequisiteId, courseId: courseData.getCourse.id },
        },
      });
      setPrerequisites(
        prerequisites.filter(
          (prerequisite) => prerequisite.id !== prerequisiteId
        )
      );
      if (result.data.removePrerequisites == true) {
        setPopupMessage("Removed");
      } else {
        setPopupMessage("Error Removing, Contact the department");
      }
    } catch (error) {
      console.error("Error removing prerequisite:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input = {
      id: courseId,
      prerequisites: prerequisites.map(({ id, courseName, level }) => ({
        id,
        prerequisites: courseName,
        //level,
      })),
    };

    try {
      const response = await updateCourseMutation({ variables: { input } });
      if (response.data.updateCourse == "Updated SuccessFully") {
        setPopupMessage("Updated SuccessFully");
      } else {
        setPopupMessage("Error Updating.Contact the department");
      }
    } catch (error) {
      console.error("Error updating the course:", error);
    }
  };

  const getFilteredCourses = (level: string) => {
    const levelInt = parseInt(level, 10);
    return coursesData.getCourses.filter((course: any) => {
      const courseLevel = parseInt(course.level, 10);
      return courseLevel >= levelInt && courseLevel < levelInt + 100;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Existing Prerequisites */}
      {prerequisites
        .filter((prerequisite) =>
          courseData?.getCourse?.prerequisites.some(
            (p: any) => p.id === prerequisite.id
          )
        )
        .map((prerequisite) => (
          <div key={prerequisite.id} className="flex flex-col space-y-2">
            {/* Level Display */}
            <div className="border p-2">Level {prerequisite.level}</div>

            {/* Course Name Display */}
            <div className="border p-2">{prerequisite.courseName}</div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => handleRemovePrerequisite(prerequisite.id)}
              className="p-2 bg-red-500 text-white"
            >
              Remove
            </button>
          </div>
        ))}
      {/* Add New Prerequisites */}
      {prerequisites
        .filter(
          (prerequisite) =>
            !courseData?.getCourse?.prerequisites.some(
              (p: any) => p.id === prerequisite.id
            )
        )
        .map((prerequisite) => (
          <div key={prerequisite.id} className="flex flex-col space-y-2">
            {/* Level Select */}
            <select
              value={prerequisite.level}
              onChange={(e) =>
                handleLevelChange(prerequisite.id, e.target.value)
              }
              className="border p-2"
            >
              <option value="">Select a level</option>
              {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>

            {/* Course Name Select */}
            <select
              value={prerequisite.courseName}
              onChange={(e) =>
                handleCourseChange(prerequisite.id, e.target.value)
              }
              className="border p-2"
            >
              <option value="">Select a course</option>
              {prerequisite.level &&
                getFilteredCourses(prerequisite.level).map((course: any) => (
                  <option key={course.id} value={course.courseName}>
                    {course.courseName}
                  </option>
                ))}
            </select>
          </div>
        ))}
      {/* Add Prerequisite Button */}
      <button
        type="button"
        onClick={handleAddPrerequisite}
        className="p-2 bg-blue-500 text-white"
      >
        Add Prerequisite
      </button>
      &nbsp;&nbsp;&nbsp;
      {/* Submit Button */}
      <button type="submit" className="p-2 bg-green-500 text-white">
        Submit
      </button>
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
    </form>
  );
};

export default UpdateCoursePage;
