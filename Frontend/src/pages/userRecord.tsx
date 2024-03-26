import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { GETSINGLEUSER } from "../graphql/queries";

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

const AdvisoryRecordsPage: React.FC = () => {
  const router = useRouter();

  const { loading, error, data } = useQuery(GETSINGLEUSER, {
    variables: { input: { email: router.query.email } },
  });

  const gotoAddRecordPage = () => {
    router.push({
      pathname: "/useraddadvisoryrecord",
      query: { email: data.getSingleUser.email },
    });
  };

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
  //console.log(`record`, advisoryRecords);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Advisory Records</h1>
        <button
          onClick={gotoAddRecordPage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Advisory Record
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 border border-gray-300">Date</th>
            <th className="p-4 border border-gray-300">Term</th>
            <th className="p-4 border border-gray-300">Status</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PageComponent: React.FC = () => {
  return (
    <div>
      <Header />
      <AdvisoryRecordsPage />
      {/* Rest of your page content */}
    </div>
  );
};

export default PageComponent;

//export default AdvisoryRecordsPage;
