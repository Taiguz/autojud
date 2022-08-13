export class AuthError extends Error {
    //TODO: Revisar isso aqui, qual o tipo de options?
    constructor(message = "", options?: any) {
      super(message);
    }
}

export class AuthErrorUnVerifiedAccount extends Error {
  //TODO: Revisar isso aqui, qual o tipo de options?
  constructor(message = "", options?: any) {
    super(message);
  }
}

export class CustomValidatorError extends Error {
  //TODO: Revisar isso aqui, qual o tipo de options?
  constructor(message = "", options?: any) {
    super(message);
  }
}