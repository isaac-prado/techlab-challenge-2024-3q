export interface IUserCreateForm {
    username: string;
    email: string;
    password: string;
    profile: 'sudo' | 'standard';
}