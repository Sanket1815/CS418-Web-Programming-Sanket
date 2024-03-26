import { useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { GET_USERS } from "../graphql/queries";
import { UPDATE_ADVISORY_RECORD } from "../graphql/mutations";
import ViewAdvisoryRecordsPage from "./adminStudentRecord";

const Header: React.FC = () => {
  const router = useRouter();
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

export interface Users {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  address: string;
  mobileNumber: number;
  lastName: string;
  isAdmin: boolean;
  advisoryRecords: [
    {
      id: string;
      createdAt: string;
      term: string;
      lastTerm: string;
      gpa: string;
      status: string;
      courses: {
        courseName: string;
        level: string;
      };
      prerequisites: {
        level: string;
        courseName: string;
      };
    }
  ];
}

const StudentsTable = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_USERS);
  const [popupMessage, setPopupMessage] = useState("");
  const [updateAdvisoryRecord, { data: updateData }] = useMutation(
    UPDATE_ADVISORY_RECORD
  );
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const handleUpdate = async (id: string, status: string) => {
    const response = await updateAdvisoryRecord({
      variables: { input: { id, status } },
    });
    if (response.data.updateUserAdvisoryStatus == true) {
      setPopupMessage("Record Updated");
    }
  };

  const handleUserRecord = (email: string) => {
    //setSelectedEmail(email);
    router.push({
      pathname: "/adminStudentRecord",
      query: { email: email },
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr className="text-xs font-semibold tracking-wide text-gray-700 uppercase border-b bg-gray-50">
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Term</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y">
          {data.getUser.map((user: Users) =>
            user.advisoryRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-100">
                <td className="px-4 py-3 border">
                  <span
                    className="cursor-pointer underline"
                    onClick={() => handleUserRecord(user.email)}
                  >
                    {user.name} {user.lastName}
                  </span>
                </td>
                <td className="px-4 py-3 border">{record.term}</td>
                <td className="px-4 py-3 border">{record.status}</td>
                <td className="px-4 py-3 border flex space-x-2">
                  {record.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleUpdate(record.id, "Approved")}
                        className="px-4 py-2 font-medium text-white bg-green-500 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdate(record.id, "Rejected")}
                        className="px-4 py-2 font-medium text-white bg-red-500 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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
      <StudentsTable />
      {/* Rest of your page content */}
    </div>
  );
};

export default PageComponent;

//export default StudentsTable;
