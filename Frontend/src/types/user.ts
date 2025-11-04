export type Role = 'Admin' | 'Editor' | 'Viewer';


export interface Address {
street: string;
city: string;
zipcode: string;
}


export interface Company {
name: string;
}


export interface User {
id?: string;
name: string;
username: string;
email: string;
phone?: string;
website?: string;
isActive: boolean;
skills: string[];
availableSlots: string[]; // ISO strings
address: Address;
company: Company;
role: Role;
}