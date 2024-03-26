// pages/verify-code.js
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { VERIFYOTP } from "../graphql/mutations";
import Header from "./header";

const VerifyCode = () => {
  const [otp, setCode] = useState<number>();
  const [verifyCode, { data, loading, error }] = useMutation(VERIFYOTP);
  const [popupMessage, setPopupMessage] = useState("");
  const router = useRouter();
  const { email } = router.query;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const verifyOtp = await verifyCode({
        variables: { input: { email, otp } },
      });
      if (!verifyOtp.data.verifyOtp) {
        setPopupMessage("Invalid OTP");
      } else {
        router.push({
          pathname: "/resetpassword",
          query: { email: email },
        }); // Redirect to reset password page
      }
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-indigo-400">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-xl font-bold text-center text-gray-700">
          Enter Verification Code
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="number"
              placeholder="Verification code"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={otp}
              onChange={(e) => setCode(e.target.valueAsNumber)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Verify Code
          </button>
        </form>
        {loading && <p className="text-center text-blue-600">Verifying...</p>}
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
      <VerifyCode />
      {/* Rest of your page content */}
    </div>
  );
};

export default PageComponent;

//export default VerifyCode;
