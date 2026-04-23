import { gql } from "@apollo/client";

export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
      userId
      bookId
      reservationDate
      dueDate
      status
      user {
        id
        name
      }
      book {
        id
        title
      }
      createdAt
    }
  }
`;

export const RETURN_BOOK = gql`
  mutation ReturnBook($reservationId: ID!) {
    returnBook(reservationId: $reservationId) {
      id
      status
      returnDate
      book {
        id
        title
      }
      user {
        id
        name
      }
    }
  }
`;
