import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COURSES, GETSINGLEUSER } from "../graphql/queries";
import { ADD_ADVISORY_RECORD } from "../graphql/mutations";
import { useRouter } from "next/router";
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

  const goToHomePage = () => {
    router.push({
      pathname: "/home",
      query: { email: router.query.email },
    });
  };

  return (
    <nav className="bg-gray-800 z-10 relative">
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
              <button
                onClick={goToHomePage}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const AdvisoryForm = () => {
  const router = useRouter();
  const {
    loading: courseLoading,
    error: courseError,
    data: courseData,
  } = useQuery(GET_COURSES);
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GETSINGLEUSER, {
    variables: { input: { email: router.query.email } },
  });
  const [popupMessage, setPopupMessage] = useState("");
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [createAdvisoryRecord] = useMutation(ADD_ADVISORY_RECORD);
  const [advisoryInput, setAdvisoryInput] = useState({
    id: userData.getSingleUser.id,
    term: "",
    lastTerm: "",
    gpa: "",
    status: "",
    courses: [
      {
        level: "",
        courseName: "",
      },
    ],
    prerequisites: [
      {
        level: "",
        courseName: "",
      },
    ],
  });

  // useEffect(() => {
  //   const iframe = document.querySelector("iframe") as HTMLIFrameElement;

  //   if (iframe) {
  //     iframe.onload = () => {
  //       const doc = iframe.contentDocument || iframe.contentWindow?.document;
  //       if (doc) {
  //         const observer = new MutationObserver((mutations) => {
  //           mutations.forEach((mutation) => {
  //             if (
  //               mutation.addedNodes.length > 0 &&
  //               mutation.addedNodes[0].nodeType === Node.ELEMENT_NODE
  //             ) {
  //               const element = mutation.addedNodes[0] as HTMLElement;
  //               if (element.textContent?.includes("Thank you")) {
  //                 router.push({
  //                   pathname: "/userRecord",
  //                   query: { email: userData.getSingleUser.email },
  //                 });
  //               }
  //             }
  //           });
  //         });
  //         observer.observe(doc.body, { childList: true, subtree: true });
  //         return () => observer.disconnect();
  //       }
  //     };
  //   }
  // }, []);

  // const handleGoToForm = () => {
  //   window.open(
  //     "https://docs.google.com/forms/d/e/1FAIpQLSfCuhwoj1Jy-RKCtoRlLk0Me1gvu7Ad0gSaeeABeDHKZsCS4A/viewform?usp=sf_link"
  //   );
  // };

  //   const handleInputChange = (e: any, index: any, field: any) => {
  //     const { value } = e.target;
  //     setAdvisoryInput((prevState: any) => ({
  //       ...prevState,
  //       [field]:
  //         field === "courses"
  //           ? prevState[field].map((course: any, i: any) =>
  //               i === index ? { ...course, [e.target.name]: value } : course
  //             )
  //           : field === "prerequisites"
  //           ? prevState[field].map((prerequisite: any, i: any) =>
  //               i === index
  //                 ? { ...prerequisite, [e.target.name]: value }
  //                 : prerequisite
  //             )
  //           : value,
  //     }));
  //   };

  //   const handleInputChange = (e: any, index: any, field: any, property: any) => {
  //     const value = e.target.value;
  //     setAdvisoryInput((prevState: any) => ({
  //       ...prevState,
  //       [field]:
  //         field === "courses"
  //           ? prevState[field].map((course: any, i: any) =>
  //               i === index ? { ...course, [property]: value } : course
  //             )
  //           : field === "prerequisites"
  //           ? prevState[field].map((prerequisite: any, i: any) =>
  //               i === index
  //                 ? { ...prerequisite, [property]: value }
  //                 : prerequisite
  //             )
  //           : prevState[field],
  //     }));
  //   };

  const getFilteredCourses = (level: string) => {
    const levelInt = parseInt(level, 10);
    return courseData.getCourses.filter((course: any) => {
      const courseLevel = parseInt(course.level, 10);
      return courseLevel >= levelInt && courseLevel < levelInt + 100;
    });
  };

  const getFilteredPrerequisites = (level: string) => {
    const levelInt = parseInt(level, 10);
    return courseData.getCourses.reduce((acc: any[], course: any) => {
      course.prerequisites.forEach((prerequisite: any) => {
        const prerequisiteLevel = parseInt(prerequisite.prerequisitesLevel, 10);
        if (
          prerequisiteLevel >= levelInt &&
          prerequisiteLevel < levelInt + 100
        ) {
          acc.push({
            id: prerequisite.id,
            courseName: prerequisite.prerequisites,
          });
        }
      });
      return acc;
    }, []);
  };

  const handleInputChange = (
    e: any,
    index: any,
    field: any,
    valueOrProperty: any
  ) => {
    setAdvisoryInput((prevState: any) => {
      if (
        index !== null &&
        (field === "courses" || field === "prerequisites")
      ) {
        return {
          ...prevState,
          [field]: prevState[field].map((item: any, i: any) =>
            i === index ? { ...item, [valueOrProperty]: e.target.value } : item
          ),
        };
      } else {
        return {
          ...prevState,
          [field]: valueOrProperty,
        };
      }
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await createAdvisoryRecord({
        variables: { input: advisoryInput },
      });
      console.log(response);
      if (
        response.data.createUserAdvisoryRecord == "Record inserted successfully"
      ) {
        setPopupMessage("Record inserted successfully");
        router.push({
          pathname: "/userRecord",
          query: { email: userData.getSingleUser.email },
        });
      } else {
        setPopupMessage(response.data.createUserAdvisoryRecord);
      }
    } catch (error) {
      console.error("Error creating advisory record:", error);
      // Handle error (e.g., show error message)
    }
  };

  const handleFeedbackResponse = (acceptFeedback: any) => {
    console.log("Feedback response:", acceptFeedback);
    setShowFeedbackPrompt(false);
    if (acceptFeedback) {
      setShowFeedbackForm(true);
    } else {
      router.push({
        pathname: "/userRecord",
        query: { email: userData.getSingleUser.email },
      });
    }
  };

  const handleAddPrerequisite = () => {
    setAdvisoryInput({
      ...advisoryInput,
      prerequisites: [
        ...advisoryInput.prerequisites,
        { level: "", courseName: "" },
      ],
    });
  };

  const handleAddCoursePlan = () => {
    setAdvisoryInput({
      ...advisoryInput,
      courses: [...advisoryInput.courses, { level: "", courseName: "" }],
    });
  };

  const LevelDropdown = ({ index, value, handleChange }: any) => (
    <select
      name={`courses[${index}].level`}
      id={`courses-level-${index}`}
      value={value}
      onChange={handleChange}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
      <option value="">Select Level</option>
      {Array.from({ length: 9 }, (_, i) => i + 1).map((level) => (
        <option key={level * 100} value={level * 100}>
          {level * 100}
        </option>
      ))}
    </select>
  );

  const CourseNameDropdown = ({ index, value, handleChange, level }: any) => (
    <select
      name={`courses[${index}].courseName`}
      id={`courses-courseName-${index}`}
      value={value}
      onChange={handleChange}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    >
      <option value="">Select Course</option>
      {getFilteredCourses(level).map((course: any) => (
        <option key={course.id} value={course.courseName}>
          {course.courseName}
        </option>
      ))}
    </select>
  );

  // const Modal = ({ children, onClose }: any) => {
  //   return (
  //     <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex justify-center items-center z-50">
  //       <div className="relative bg-white p-5 rounded-lg shadow-lg max-w-4xl w-full mx-4 my-8">
  //         {children}
  //         <button
  //           className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-800"
  //           onClick={onClose}
  //         >
  //           <span className="text-2xl">&times;</span>{" "}
  //           {/* Unicode for 'x' character */}
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  const PrerequisitesNameDropdown = ({
    index,
    value,
    handleChange,
    level,
  }: any) => {
    const filteredCourses = courseData.getCourses.filter(
      (course: any) =>
        parseInt(course.level) >= parseInt(level) &&
        parseInt(course.level) < parseInt(level) + 100
    );

    const filteredNames = filteredCourses.map((name: any) => name.courseName);
    const prerequisitesCourses = courseData.getCourses
      .map((course: any) =>
        course.prerequisites.map((prerequisite: any) => {
          return {
            id: prerequisite.id,
            courseName: prerequisite.prerequisites,
          };
        })
      )
      .flat();
    const prerequisitesWithSameNames = prerequisitesCourses.filter(
      (item: any) => filteredNames.includes(item.courseName)
    );
    const uniqueCourses = [
      ...prerequisitesWithSameNames
        .reduce((acc: any, item: any) => {
          const key = item.courseName;
          if (!acc.has(key)) {
            acc.set(key, item);
          }
          return acc;
        }, new Map())
        .values(),
    ];

    return (
      <select
        name={`prerequisites[${index}].courseName`}
        id={`prerequisites-courseName-${index}`}
        value={value}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="">Select Course</option>
        {uniqueCourses.map((prerequisite: any) => (
          <option key={prerequisite.id} value={prerequisite.courseName}>
            {prerequisite.courseName}
          </option>
        ))}
      </select>
    );
  };

  if (courseLoading) return <p>Loading...</p>;
  if (courseError) return <p>Error :(</p>;

  return (
    // <div className="p-6 max-w-3xl w-full mx-auto bg-white rounded-md shadow-lg">
    <div className="fixed inset-0 bg-white pt-16 overflow-y-auto">
      <form onSubmit={handleSubmit} className="w-screen h-screen p-6">
        <div className="space-y-4 w-full">
          <h2 className="text-xl font-semibold">Course Advising Form</h2>
          <p className="text-gray-600">
            Fill in the details below to plan your courses for the upcoming
            term.
          </p>
        </div>

        {/* Header Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Header</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="lastTerm"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Last Term
              </label>
              <input
                type="text"
                name="lastTerm"
                id="lastTerm"
                value={advisoryInput.lastTerm}
                onChange={(e) =>
                  handleInputChange(e, null, "lastTerm", e.target.value)
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Last Term"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="gpa"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                GPA
              </label>
              <input
                type="number"
                step="0.01"
                name="gpa"
                id="gpa"
                value={advisoryInput.gpa}
                onChange={(e) =>
                  handleInputChange(e, null, "gpa", e.target.value)
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter GPA"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="term"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Current Term
              </label>
              <input
                type="text"
                name="term"
                id="term"
                value={advisoryInput.term}
                onChange={(e) =>
                  handleInputChange(e, null, "term", e.target.value)
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Current Term"
              />
            </div>
            {/* <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Status
              </label>
              <select
                name="status"
                id="status"
                value={advisoryInput.status}
                onChange={(e) => handleInputChange(e, null, "status")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div> */}
          </div>
        </div>

        {/* Pre-requisite Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pre-requisites</h3>
          {advisoryInput.prerequisites.map((prerequisite, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LevelDropdown
                type="text"
                index={index}
                value={prerequisite.level}
                handleChange={(e: any) =>
                  handleInputChange(e, index, "prerequisites", "level")
                }
              />
              <PrerequisitesNameDropdown
                type="text"
                index={index}
                value={prerequisite.courseName}
                handleChange={(e: any) =>
                  handleInputChange(e, index, "prerequisites", "courseName")
                }
                level={prerequisite.level}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPrerequisite}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            + Add Pre-requisite
          </button>
        </div>

        {/* Course Plan Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Course Plan</h3>
          {advisoryInput.courses.map((course, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LevelDropdown
                type="text"
                index={index}
                value={course.level}
                handleChange={(e: any) =>
                  handleInputChange(e, index, "courses", "level")
                }
              />
              <CourseNameDropdown
                type="text"
                index={index}
                value={course.courseName}
                handleChange={(e: any) =>
                  handleInputChange(e, index, "courses", "courseName")
                }
                level={course.level}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCoursePlan}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            + Add Course
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Record
          </button>
        </div>
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
    </div>
  );
};

const PageComponent: React.FC = () => {
  return (
    <div>
      <Header />
      <AdvisoryForm />
      {/* Rest of your page content */}
    </div>
  );
};

export default PageComponent;

//export default AdvisoryForm;
