import { ConflictError, NotFoundError } from "../errors.ts";

export function customerNotFound(): NotFoundError {
  return new NotFoundError("Customer was not found.");
}

export function cleanerNotFound(): NotFoundError {
  return new NotFoundError("Cleaner was not found.");
}

export function catalogItemNotFound(): NotFoundError {
  return new NotFoundError("Service offering was not found.");
}

export function bookingNotFound(): NotFoundError {
  return new NotFoundError("Booking was not found.");
}

export function reviewNotFound(): NotFoundError {
  return new NotFoundError("Review was not found.");
}

export function notificationNotFound(): NotFoundError {
  return new NotFoundError("Notification was not found.");
}

export function userNotFound(): NotFoundError {
  return new NotFoundError("User was not found.");
}

export function invalidBookingTransition(): ConflictError {
  return new ConflictError("This booking status change is not allowed.");
}

export function cleanerNotAvailable(): ConflictError {
  return new ConflictError("This cleaner is not available for assignment.");
}

export function bookingConflict(): ConflictError {
  return new ConflictError("The booking was updated by another request.");
}
