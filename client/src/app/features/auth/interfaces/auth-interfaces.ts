export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  user: {
    id: number;
    username: string;
    email: string;
  };


}

export interface resetPasswordRequest {
  code: string;
  password: string;
  passwordConfirmation: string;

}
export interface Role {
  id: number;
  name: string;
  description: string;
  type: string;
}
// export interface User{
//   id: number;
//   documentId: string;
//   username: string;
//   email: string;
//   age: number;
//   address: string;
//   // role: Role;

// };

//use follow

export interface ImageFormat {
  url: string;
}

export interface Image {
  id: number;
  url: string;
  formats: {
    thumbnail?: ImageFormat;
  };
}

export interface User {
  id: number;

  username: string;
  email: string;
  age: number;
  address: string;
  job: string;
  bio: string;
  date_of_birth: string;
  image?: Image;
  role: Role;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}


