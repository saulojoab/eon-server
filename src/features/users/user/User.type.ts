export interface IUser {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  favorites: string[];
  createdAt: Date;
  updatedAt: Date;
}
