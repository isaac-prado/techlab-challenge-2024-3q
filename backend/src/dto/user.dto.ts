import { profiles } from "../constants/profiles.js";

export class UserCreateDto {
    username: string;
    password: string;
    email: string;
    profile: keyof typeof profiles;

    constructor(username: string, email: string, password: string, profile: 'standard' | 'sudo') {
        this.username = username;
        this.email = email;
        this.password = password;
        this.profile = profile;
      }
}