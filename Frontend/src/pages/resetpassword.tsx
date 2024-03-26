// pages/reset-password.js
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { PASSWORD_RESET } from "../graphql/mutations";
import Header from "./header";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { data, loading, error }] = useMutation(PASSWORD_RESET);
  const [popupMessage, setPopupMessage] = useState("");
  const router = useRouter();
  const { email } = router.query;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const checkPassword = await resetPassword({
        variables: { input: { email, password, confirmPassword } },
      });
      if (checkPassword.data.passwordReset == "Password Changed") {
        router.push("/login");
      } else if (
        checkPassword.data.passwordReset == "Password did not matched"
      ) {
        setPopupMessage("Password did not matched");
      }
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-sky-300">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-xl font-bold text-center text-gray-700">
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset Password
          </button>
        </form>
        {loading && (
          <p className="text-center text-blue-600">Resetting password...</p>
        )}
        {/* {error && (
          <p className="text-center text-red-600">Error: {error.message}</p>
        )} */}
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
    </div>
  );
};

const PageComponent: React.FC = () => {
  return (
    <div>
      <Header />
      <ResetPassword />
      {/* Rest of your page content */}
    </div>
  );
};

export default PageComponent;

//export default ResetPassword;
