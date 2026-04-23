import { gql } from "@apollo/client";

const RESERVATION_FIELDS = gql`
  fragment ReservationFields on Reservation {
    id
    userId
    bookId
    reservationDate
    dueDate
    returnDate
    status
    user {
      id
      name
      email
    }
    book {
      id
      title
      author
      isbn
    }
    createdAt
  }
`;

export const GET_ALL_RESERVATIONS = gql`
  ${RESERVATION_FIELDS}
  query GetAllReservations($page: Int, $limit: Int) {
    reservations(page: $page, limit: $limit) {
      items {
        ...ReservationFields
      }
      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;

export const GET_RESERVATIONS_BY_BOOK = gql`
  ${RESERVATION_FIELDS}
  query GetReservationsByBook(
    $bookId: ID!
    $fromDate: String
    $toDate: String
    $page: Int
    $limit: Int
  ) {
    reservationsByBook(
      bookId: $bookId
      fromDate: $fromDate
      toDate: $toDate
      page: $page
      limit: $limit
    ) {
      items {
        ...ReservationFields
      }
      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;

export const GET_RESERVATIONS_BY_USER = gql`
  ${RESERVATION_FIELDS}
  query GetReservationsByUser(
    $userId: ID!
    $fromDate: String
    $toDate: String
    $page: Int
    $limit: Int
  ) {
    reservationsByUser(
      userId: $userId
      fromDate: $fromDate
      toDate: $toDate
      page: $page
      limit: $limit
    ) {
      items {
        ...ReservationFields
      }
      total
      page
      limit
      totalPages
      hasNextPage
    }
  }
`;
