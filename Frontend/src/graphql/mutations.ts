import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation signup($input: UserAddParams!) {
    createUser(input: $input)
  }
`;

export const LOGIN_MUTATION = gql`
  mutation login($input: LoginParams!) {
    login(input: $input) {
      message
      token
      isAdmin
    }
  }
`;

export const VERIFY_TOKEN = gql`
  mutation verifyToken($input: VerifyTokenParams!) {
    verifyToken(input: $input)
  }
`;

export const UPDATEUSER_MUTATION = gql`
  mutation updateUser($input: UserUpdateParams!) {
    updateUser(input: $input)
  }
`;

export const APPROVE_REQUEST = gql`
  mutation ApproveRequest($input: AdminApproveParams!) {
    approveRequest(input: $input)
  }
`;

export const SENDMAILOTP = gql`
  mutation sendEmailOtp($input: EmailOTPParams!) {
    sendEmailOtp(input: $input)
  }
`;

export const VERIFYOTP = gql`
  mutation verifyOtp($input: VerifyOtpParams!) {
    verifyOtp(input: $input)
  }
`;

export const PASSWORD_RESET = gql`
  mutation passwordReset($input: PasswordResetParams!) {
    passwordReset(input: $input)
  }
`;
