// pages/admin.tsx
import React from "react";
import "tailwindcss/tailwind.css";
import { gql, useQuery, useMutation } from "@apollo/client";
import { GET_ADMIN_REQUESTS } from "../graphql/queries";
import { APPROVE_REQUEST } from "../graphql/mutations";
import Header from "./header";

const AdminPage = () => {
  // Fetching email requests
  const { loading, error, data } = useQuery(GET_ADMIN_REQUESTS);
  const [approveRequest] = useMutation(APPROVE_REQUEST);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Function to handle approval
  const handleApprove = (email: any) => {
    approveRequest({ variables: { input: { email } } });
    // You may want to refetch or update the UI here
  };

  return (
    <div className="min-h-screen bg-cyan-500 p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="overflow-x-auto bg-grey-500">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="border px-6 py-4">Email</th>
              <th className="border px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.getAdminRequests.map((request: any) => (
              <tr key={request.id}>
                <td className="border px-6 py-4">{request.email}</td>
                <td className="border px-6 py-4">
                  <button
                    onClick={() => handleApprove(request.email)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PageComponent: React.FC = () => {
  return (
    <div>
      <Header />
      <AdminPage />
      {/* Rest of your page content */}
    </div>
  );
};

export default PageComponent;
//export default AdminPage;
