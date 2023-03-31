// From the Login Project on PHP
// Currently unused
export class Users {
    id: number;
    name: string;
    email: string;
    password: string;
    userType: string;
    isActive: boolean; 

    constructor(id: number, name: string, email: string, password: string, userType: string, isActive: boolean) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.isActive = isActive;  
    }
}

// Unused
// export interface IUsers {
//     id: number,
//     name: string,
//     email: string,
//     password: string,
//     userType: string,
//     isActive: boolean
// }

// export const users = [];