import { useMutation } from "@apollo/client";
import { useState, useCallback } from "react";
import { VERIFY_TOKEN, VERIFY_RECAPTCHA } from "../graphql/mutations";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import ReCAPTCHA from "react-google-recaptcha";
import Header from "./header";
import Head from "next/head";

export interface TokenPayload {
  email: string;
  password: string;
}

const VerifyPage = () => {
  const [token, setToken] = useState("");
  const [verifyToken, { data, loading, error }] = useMutation(VERIFY_TOKEN);
  const [verifyReCaptcha] = useMutation(VERIFY_RECAPTCHA);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  const handleReCaptchaVerify = useCallback((recaptchaToken: string | null) => {
    setRecaptchaToken(recaptchaToken);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await verifyToken({ variables: { input: { token } } });
      const gettoken = localStorage.getItem("jwtToken");
      const decoded = jwtDecode<TokenPayload>(gettoken!);

      if (!recaptchaToken) {
        console.log("reCAPTCHA token is missing.");
        return;
      }

      const response = await verifyReCaptcha({
        variables: { input: { token: recaptchaToken } },
      });
      if (response.data.verifyReCapacha) {
        router.push({
          pathname: "/home",
          query: { email: decoded.email },
        });
        console.log("Verification successful!");
      } else {
        console.log("reCAPTCHA verification failed.");
      }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover"
      style={{ backgroundImage: "url('/assests/images/verifypage.png')" }}
    >
      <Head>
        <link rel="icon" href="/assests/images/odufavicon-new.ico" />
      </Head>
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
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            onChange={handleReCaptchaVerify}
            size="normal"
            badge="bottomright"
          />
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

const PageComponent: React.FC = () => {
  return (
    <div>
      <Header />
      <VerifyPage />
      {/* Rest of your page content */}
    </div>
  );
};

export default PageComponent;
