import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query {
    getUser {
      id
      createdAt
      name
      email
      isAdmin
      address
      mobileNumber
      lastName
      isAdmin
      advisoryRecords {
        id
        term
        status
        gpa
        lastTerm
        courses {
          level
          courseName
        }
        prerequisites {
          level
          courseName
        }
      }
    }
  }
`;

export const GETSINGLEUSER = gql`
  query getSingleUser($input: GetSingleUserParams!) {
    getSingleUser(input: $input) {
      id
      createdAt
      updatedAt
      name
      email
      address
      mobileNumber
      lastName
      isAdmin
      advisoryRecords {
        id
        createdAt
        term
        lastTerm
        gpa
        status
        courses {
          courseName
          level
        }
        prerequisites {
          level
          courseName
        }
      }
    }
  }
`;

export const GET_ADMIN_REQUESTS = gql`
  query {
    getAdminRequests {
      id
      email
    }
  }
`;

export const GET_COURSES = gql`
  query {
    getCourses {
      id
      courseName
      level
      department
      prerequisites {
        id
        prerequisites
      }
    }
  }
`;

export const GET_COURSE = gql`
  query getCourse($input: GetCourseParams!) {
    getCourse(input: $input) {
      id
      courseName
      level
      department
      prerequisites {
        id
        prerequisites
      }
    }
  }
`;
