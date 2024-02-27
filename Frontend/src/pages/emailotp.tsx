// pages/forgot-password.js
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SENDMAILOTP } from "../graphql/mutations";
import { useRouter } from "next/router";
import { GraphQLError } from "graphql";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sendEmail, { data, loading, error }] = useMutation(SENDMAILOTP);
  const [popupMessage, setPopupMessage] = useState("");

  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const emailVerify = await sendEmail({ variables: { input: { email } } });
    if (email == "" || email == null) {
      setPopupMessage("Enter Email");
    } else if (emailVerify.data.sendEmailOtp == "User Not Found") {
      setPopupMessage("Email is Not Registered");
    } else {
      //console.log("Success");
      router.push({
        pathname: "/verifyotp",
        query: { email: email },
      });
    }
    // Redirect to verification code page
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-semibold text-center text-gray-700">
          Enter your Email
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Verification Code
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
        {loading && <p className="text-center text-blue-600">Sending...</p>}
        {/* {error && (
          <p className="text-center text-red-600">Error: {error.message}</p>
        )} */}
      </div>
    </div>
  );
};

export default ForgotPassword;
