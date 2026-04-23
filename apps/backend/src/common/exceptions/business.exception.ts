import { GraphQLError } from "graphql";

export class BusinessException extends GraphQLError {
  constructor(message: string, code: string = "BUSINESS_RULE_VIOLATION") {
    super(message, {
      extensions: { code },
    });
  }
}

export class BookAlreadyReservedException extends BusinessException {
  constructor() {
    super(
      "This book already has an active reservation.",
      "BOOK_ALREADY_RESERVED",
    );
  }
}

export class UserReservationLimitException extends BusinessException {
  constructor() {
    super(
      "User has reached the maximum of 3 active reservations.",
      "USER_RESERVATION_LIMIT",
    );
  }
}

export class ReservationNotFoundException extends BusinessException {
  constructor(id: string) {
    super(`Reservation with id "${id}" not found.`, "RESERVATION_NOT_FOUND");
  }
}

export class ReservationAlreadyReturnedException extends BusinessException {
  constructor() {
    super(
      "This reservation has already been returned.",
      "RESERVATION_ALREADY_RETURNED",
    );
  }
}

export class BookNotFoundException extends BusinessException {
  constructor(id: string) {
    super(`Book with id "${id}" not found.`, "BOOK_NOT_FOUND");
  }
}

export class UserNotFoundException extends BusinessException {
  constructor(id: string) {
    super(`User with id "${id}" not found.`, "USER_NOT_FOUND");
  }
}

export class DuplicateEmailException extends BusinessException {
  constructor(email: string) {
    super(`A user with email "${email}" already exists.`, "DUPLICATE_EMAIL");
  }
}

export class DuplicateIsbnException extends BusinessException {
  constructor(isbn: string) {
    super(`A book with ISBN "${isbn}" already exists.`, "DUPLICATE_ISBN");
  }
}

export class InvalidDateRangeException extends BusinessException {
  constructor() {
    super("Due date must be after the reservation date.", "INVALID_DATE_RANGE");
  }
}

export class UserHasActiveReservationsException extends BusinessException {
  constructor() {
    super(
      "Cannot delete user with active reservations.",
      "USER_HAS_ACTIVE_RESERVATIONS",
    );
  }
}
