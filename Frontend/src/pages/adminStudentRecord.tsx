import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { GETSINGLEUSER } from "../graphql/queries";
import Head from "next/head";

const ViewAdvisoryRecordsPage: React.FC = () => {
  const router = useRouter();
  // console.log(email);
  const { loading, error, data } = useQuery(GETSINGLEUSER, {
    variables: { input: { email: router.query.email } },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const advisoryRecords = data?.getSingleUser.advisoryRecords || [];
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  //   const handleUserRecord = (email: string) => {
  //     return () => {
  //       router.push({
  //         pathname: "/adminStudentRecord",
  //         query: { email: email },
  //       });
  //     };
  //   };

  //   const goToProfilePage = () => {
  //     router.push({
  //       pathname: "/profile",
  //       query: { email: router.query. },
  //     });
  //   };

  //   const goToHomePage = () => {
  //     router.push({
  //       pathname: "/home",
  //       query: { email: router.query.admin },
  //     });
  //   };

  return (
    <div>
      <Head>
        <link rel="icon" href="/assests/images/odufavicon-new.ico" />
      </Head>
      <nav className="bg-gray-800">
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
                {/* <button
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
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="p-8">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 border border-gray-300">Date</th>
              <th className="p-4 border border-gray-300">Term</th>
              <th className="p-4 border border-gray-300">Status</th>
              <th className="p-4 border border-gray-300">Courses</th>
              <th className="p-4 border border-gray-300">Prerequisites</th>
            </tr>
          </thead>
          <tbody>
            {advisoryRecords.map((record: any) => (
              <tr key={record.id}>
                <td className="p-4 border border-gray-300">
                  {formatDate(record.createdAt)}
                </td>
                <td className="p-4 border border-gray-300">{record.term}</td>
                <td className="p-4 border border-gray-300">{record.status}</td>
                <td className="p-4 border border-gray-300">
                  {record.courses.map((course: any, index: any) => (
                    <div key={index}>{course.courseName}</div>
                  ))}
                </td>
                <td className="p-4 border border-gray-300">
                  {record.prerequisites.map((course: any, index: any) => (
                    <div key={index}>{course.courseName}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAdvisoryRecordsPage;
