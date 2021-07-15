export class User {
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    token: string;

    constructor(email, firstName, lastName, userName, token) {
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.userName = userName;
      this.token = token;
    }
  
  }