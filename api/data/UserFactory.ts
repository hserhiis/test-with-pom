import {UserDto} from "../models/UserDto";

export class UserFactory {
    static getValidUser(): UserDto {
        return { username: 'tomsmith', password: 'SuperSecretPassword!'}
    }

    static getInvalidUsernameUser(): UserDto {
        return { username: 'invalid', password: 'SuperSecretPassword!'}
    }

    static getInvalidPasswordUser(): UserDto {
        return { username: 'tomsmith', password: 'invalid'}
    }
}