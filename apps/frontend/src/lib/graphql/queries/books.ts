import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
      isbn
      description
      coverUrl
      isAvailable
      createdAt
    }
  }
`;

export const GET_AVAILABLE_BOOKS = gql`
  query GetAvailableBooks {
    availableBooks {
      id
      title
      author
      isbn
      description
      coverUrl
      isAvailable
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    book(id: $id) {
      id
      title
      author
      isbn
      description
      coverUrl
      isAvailable
      createdAt
      updatedAt
    }
  }
`;
