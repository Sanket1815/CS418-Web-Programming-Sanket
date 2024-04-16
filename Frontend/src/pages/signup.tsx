// pages/signup.tsx
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { SIGNUP_MUTATION } from "../graphql/mutations";
import Head from "next/head";

interface SignUpData {
  name: string;
  email: string;
  password: string;
  advisoryRecord: [];
}

const Header: React.FC = () => {
  const router = useRouter();
  console.log(`email`, router.query);
  // const goToProfilePage = () => {
  //   router.push({
  //     pathname: "/profile",
  //     query: { email: router.query.email },
  //   });
  // };

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
          {/* <div className="md:block">
            <div className="ml-auto flex items-baseline space-x-4">
              <button
                onClick={goToProfilePage}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Profile
              </button>
              <a
                href="/adminpage"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState<SignUpData>({
    name: "",
    email: "",
    password: "",
    advisoryRecord: [],
  });
  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION);
  const [popupMessage, setPopupMessage] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const router = useRouter();
  const handleSignInRedirect = () => {
    router.push("/login");
  };
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.name == "" || formData.name == null) {
        setPopupMessage("Name should not be empty");
      } else if (formData.email == "" || formData.email == null) {
        setPopupMessage("Email should not be empty");
      } else if (formData.password == "" || formData.password == null) {
        setPopupMessage("Password should not be empty");
      } else if (!passwordRegex.test(formData.password)) {
        setPopupMessage(
          "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long."
        );
      } else {
        // console.log("--------------");
        const result = await signup({ variables: { input: formData } });
        //console.log("result", result);
        if (
          result.data &&
          result.data.createUser === "Please enter a vaild email address"
        ) {
          setPopupMessage("Invalid email address");
        } else {
          router.push("./login");
        }
        // Handle success (e.g., redirect, show message)
      }
    } catch (err: any) {
      if (err.graphQLErrors?.[0]?.message == "Email already exists")
        setPopupMessage("User already exists");
      // Handle error
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover"
      // style={{ backgroundImage: "url('/assests/images/signup1.jpg')" }}
    >
      <Head>
        <link rel="icon" href="/assests/images/odufavicon-new.ico" />
      </Head>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* Name field */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            onChange={handleChange}
          />
        </div>
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
        <div className="flex items-center justify-between">
          <button
            onSubmit={handleSignInRedirect}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{" "}
            <button
              onClick={handleSubmit}
              className="text-blue-500 hover:text-blue-700"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

const PageComponent: React.FC = () => {
  return (
    <div>
      <Header />
      <Signup />
      {/* Rest of your page content */}
    </div>
  );
};

export default PageComponent;
