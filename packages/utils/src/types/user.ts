export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegistrationInput {
  email: string;
    phone: string;
    altPhone?: string;
    firstName: string;
    lastName: string;
    password: string;
    companyName: string;
    address: string;
    state: string;
    pin: string;
    country: string;
    defaultCurrency?: string;
    pan: string;
    gst?: string;
    nationalId: string;
}

export type UserLoginInput = LoginInput;
export type UserRegistartionInput = RegistrationInput;