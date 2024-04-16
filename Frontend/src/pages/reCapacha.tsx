// // components/MyComponent.tsx
// import React, { useState, useCallback } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
// import { useMutation } from "@apollo/client";
// import { VERIFY_RECAPCHA } from "../graphql/mutations";

// const MyComponent: React.FC = () => {
//   const [token, setToken] = useState<string | null>(null);
//   const [verifyReCaptcha] = useMutation(VERIFY_RECAPCHA);

//   const handleReCaptchaVerify = useCallback((recaptchaToken: string | null) => {
//     setToken(recaptchaToken);
//   }, []);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (token) {
//       try {
//         const response = await verifyReCaptcha({
//           variables: { input: { token } },
//         });
//         // Handle the response from the mutation
//         console.log("Verification response:", response.data.verifyReCaptcha);
//       } catch (error) {
//         console.error("Error verifying reCAPTCHA:", error);
//       }
//     } else {
//       console.log("reCAPTCHA token is missing.");
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         {/* Your form inputs */}
//         <ReCAPTCHA
//           sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
//           onChange={handleReCaptchaVerify}
//           size="invisible"
//           badge="inline"
//         />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default MyComponent;
