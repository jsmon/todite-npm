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
}
