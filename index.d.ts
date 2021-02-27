// Turn `no-unused-vars` off because this is a declaration file
/* eslint no-unused-vars: "off" */

export interface Todo {
    _id: string;
    name: string;
    completed: boolean;
    user: string;
    date?: Date;
}

export = class Todite {
    private apiKey: string;
    public apiKeyRegex: RegExp;

    constructor(private apiKey: string);

    public create({ name, completed, date }: Todo): Promise<Todo>;
    public getAll(): Promise<Todo[]>;
    public get(id: string): Promise<Todo>;
}
