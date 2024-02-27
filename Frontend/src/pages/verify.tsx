import { useMutation } from "@apollo/client";
import { useState } from "react";
import { VERIFY_TOKEN } from "../graphql/mutations";
import { useRouter } from "next/router";
//const jwt_decode = require("jwt-decode");
//import * as jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

export interface TokenPayload {
  email: string;
  password: string;
} // Adjust the import path as needed

const VerifyPage = () => {
  const [token, setToken] = useState("");
  const [verifyToken, { data, loading, error }] = useMutation(VERIFY_TOKEN);
  const router = useRouter();
  //console.log("email", router.query.email);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await verifyToken({ variables: { input: { token } } });
      const gettoken = localStorage.getItem("jwtToken");
      // console.log("token", gettoken);
      const decoded = jwtDecode<TokenPayload>(gettoken!);
      // console.log("email", decoded.email);
      router.push({
        pathname: "/profile",
        query: { email: decoded.email },
      });
      // console.log("data", data);
      // Handle success (e.g., show a success message, redirect, etc.)
      console.log("Verification successful!"); // Replace with appropriate actions
    } catch (err) {
      // Handle error (e.g., show an error message)
      console.error("Verification failed:", err); // Replace with appropriate actions
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover"
      style={{ backgroundImage: "url('/assests/images/verifypage.png')" }}
    >
      <div className="w-full max-w-xs">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-6">
            <label
              htmlFor="token"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Verification Token:
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your token"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              Verify
            </button>
          </div>
          {data && <p className="text-green-500">{data.verifyToken.message}</p>}
          {error && <p className="text-red-500">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
