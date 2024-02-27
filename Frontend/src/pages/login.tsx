// pages/login.tsx
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from "../graphql/mutations";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  email: string;
  password: string;
}

const Login = () => {
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [popupMessage, setPopupMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleForgotPasswordClick = () => {
    router.push("/emailotp"); // Navigate to reset password page
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login({ variables: { input: formData } });
      //console.log(`Result ${JSON.stringify(result)}`);
      const { message, token } = result.data.login;
      //console.log(message, "message");
      //console.log("token", token);

      // Assuming the mutation result contains a field 'data' with the user's information on success
      if (
        result.data &&
        message == "Approval pending! Try after some time"
        //result.data.login == "Approval pending! Try after some time"
      ) {
        setPopupMessage("Approval Pending! Try after some time.");
        // Here you can redirect or perform other actions as needed
        // router.push("/verify");
      } else if (
        result.data &&
        message == "Wait for Approval! Try after some time"
        //result.data.login == "Wait for Approval! Try after some time"
      ) {
        setPopupMessage("Wait for Approval! Try after some time");
      } else if (
        result.data &&
        message == "User Not Found"
        //result.data.login == "User Not Found"
      ) {
        setPopupMessage("User not found");
      } else if (
        result.data &&
        message == "InCorrect Password"
        //result.data.login == "InCorrect Password"
      ) {
        setPopupMessage("InCorrect Password");
      } else if (result.data && message === "Successfully LoggedIn") {
        // Store the token for future requests
        if (!!result.data.login.isAdmin) {
          // Assuming 'isAdmin' is a flag in your response
          // Redirect to the admin profile page
          const decoded = jwtDecode<TokenPayload>(token!);
          router.push({
            pathname: "/profile",
            query: { email: decoded.email },
          }); // Change '/adminProfile' to the actual admin profile path
        } else {
          localStorage.setItem("jwtToken", token);
          router.push({
            pathname: "/verify",
            query: { email: token },
          });
        }
      } else {
        setPopupMessage("Error Logging In");
      }
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover"
      style={{ backgroundImage: "url('/assests/images/login1.jpg')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* Email field */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
          />
        </div>
        {/* Password field */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Log In
          </button>
        </div>
        <a
          onClick={handleForgotPasswordClick}
          className="cursor-pointer inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        >
          Forgot Password?
        </a>
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

export default Login;
//export {};
