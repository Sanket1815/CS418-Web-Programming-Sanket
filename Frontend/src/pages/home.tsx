import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GETSINGLEUSER } from "../graphql/queries";
import Head from "next/head";

const Home: React.FC = () => {
  const router = useRouter();
  console.log(`router`, router);
  const { loading, error, data } = useQuery(GETSINGLEUSER, {
    variables: { input: { email: router.query.email } },
  });
  console.log(`data`, data);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (data && data.getSingleUser) {
      setIsAdmin(data.getSingleUser.isAdmin);
    }
  }, [data]);

  const navigate = (path: any) => {
    router.push(path);
  };

  const gotoProfilePage = () => {
    router.push({
      pathname: "/profile",
      query: { email: data.getSingleUser.email },
    });
  };

  const handleAdvisoryPortalClick = () => {
    router.push({
      pathname: "/courses",
      query: { email: router.query.email },
    });
  };

  const gotoCoursesPage = () => {
    router.push("./viewcourses");
  };

  const gotoRequetsPage = () => {
    router.push({
      pathname: "/adminpage",
      query: { email: data.getSingleUser.email },
    });
  };

  const gotoUserRecordPage = () => {
    router.push({
      pathname: "/userRecord",
      query: { email: data.getSingleUser.email },
    });
  };

  const gotoUserRecordStatus = () => {
    router.push({
      pathname: "/studentsStatus",
      query: { email: data.getSingleUser.email },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Head>
        <link rel="icon" href="/assests/images/odufavicon-new.ico" />
      </Head>
      {/* Header Section */}
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8"
                src="/assests/images/odulog.png"
                alt="Your Logo"
              />
            </div>
            {/* Navigation Links */}
            {/* <div className="hidden sm:flex sm:items-stretch sm:justify-start">
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"> */}
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <button
                  onClick={gotoProfilePage}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </button>
                {isAdmin && (
                  <>
                    <button
                      onClick={gotoRequetsPage}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Requests
                    </button>
                    <button
                      onClick={gotoUserRecordStatus}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Student Record
                    </button>
                    <div className="relative group">
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        <span>Courses</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ml-2 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <div
                        className={`absolute ${
                          isOpen ? "block" : "hidden"
                        } bg-white text-black w-48 mt-2 rounded-md shadow-lg`}
                      >
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            handleAdvisoryPortalClick();
                          }}
                          className="block px-4 py-2 text-sm hover:bg-gray-200"
                        >
                          Add Course
                        </button>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            gotoCoursesPage();
                          }}
                          className="block px-4 py-2 text-sm hover:bg-gray-200"
                        >
                          View Courses
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {!isAdmin && (
                  <>
                    <button
                      onClick={gotoCoursesPage}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Courses
                    </button>
                    <button
                      onClick={gotoUserRecordPage}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Student Record
                    </button>
                    <button
                      onClick={() => navigate("/contactus")}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Contact Us
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* </div>
            </div> */}
            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
              >
                <svg
                  className={`h-6 w-6 ${isMenuOpen ? "hidden" : "block"}`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`h-6 w-6 ${isMenuOpen ? "block" : "hidden"}`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        <div className={`sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={gotoProfilePage}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Profile
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={gotoRequetsPage}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Requests
                </button>
                <button
                  onClick={gotoUserRecordStatus}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Student Record
                </button>
                <button
                  onClick={() => {
                    setIsOpen(!isOpen);
                    handleAdvisoryPortalClick();
                  }}
                  className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  <span>Courses</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ml-2 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute ${
                    isOpen ? "block" : "hidden"
                  } bg-white text-black w-48 mt-2 rounded-md shadow-lg`}
                >
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      gotoCoursesPage();
                    }}
                    className="block px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    View Courses
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleAdvisoryPortalClick();
                    }}
                    className="block px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Add Course
                  </button>
                </div>
              </>
            )}
            {!isAdmin && (
              <>
                <button
                  onClick={gotoCoursesPage}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Courses
                </button>
                <button
                  onClick={gotoUserRecordPage}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Student Record
                </button>
                <button
                  onClick={() => navigate("/contactus")}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Contact Us
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Section */}
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-3xl font-bold">Welcome!</h1>
        {/* Additional content for the Home component */}
      </main>
    </div>
  );
};

export default Home;
