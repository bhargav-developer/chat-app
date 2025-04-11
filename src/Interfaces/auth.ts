interface AuthBase {
    email: string;
    password: string;
  }
  
export interface signupPayload extends AuthBase {
    firstName: string;
    lastName: string;
    confirmPassword?: string;
  }
  
  export interface loginPayload extends AuthBase {
    rememberMe?: boolean;
  }
  