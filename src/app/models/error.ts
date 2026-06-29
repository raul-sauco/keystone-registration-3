export class InvalidTripCodeError extends Error {
  constructor() {
    super('Invalid trip code');
  }
}

export class ServerUnavailableError extends Error {
  constructor() {
    super('Server unavailable');
  }
}
