// Turn `no-unused-vars` off because this is a declaration file
/* eslint no-unused-vars: "off" */

/** A to-do object */
export interface Todo {
    /** The to-dos ID */
    _id: string;
    /** The name of the to-do (what to do) */
    name: string;
    /** Whether the to-do is done */
    completed: boolean;
    /** The authors Firebase UID */
    user: string;
    /** When the to-do needs to be done by */
    date?: Date;
}

/** A to-do, but no properties are required */
export type PartialTodo = {
    [K in keyof Todo]?: Todo[K];
};

/** The main `Todite` class */
export = class Todite {
    /** The user's API key */
    private apiKey: string;
    /** The regular expression that validates API keys */
    public apiKeyRegex: RegExp;

    constructor(apiKey: string): void;

    /** Create a to-do */
    public create({ name, completed, date }: {
        name: string;
        completed?: boolean;
        date?: Date;
    }): Promise<Todo>;
    /** Get all of your to-dos */
    public getAll(): Promise<Todo[]>;
    /**
     * Get a to-do
     * @param id The ID of the to-do you want to get
     */
    public get(id: string): Promise<Todo>;
    /**
     * Update a to-do
     * @param newTodoData The to-dos new data
     */
    public update(newTodoData: PartialTodo & { id: string; }): Promise<Todo>;
    /**
     * Update a to-do
     * @param id The ID of the to-do you want to update
     * @param name The to-dos new name
     * @param completed Whether the to-do has now been completed or not
     * @param date When the to-do now has to be done by
     */
    public update(id: string, name?: string, completed?: boolean, date?: Date): Promise<Todo>;
    /**
     * Delete a to-do
     * @param id The ID of the to-do that you want to delete
     */
    public delete(id: string): Promise<void>;
}
