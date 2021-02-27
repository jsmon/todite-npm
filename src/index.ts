import fetch from 'node-fetch';

import { Todo, PartialTodo } from '..';

interface ApiError {
    status: number;
    message: string;
}

export = class Todite {
    public apiKeyRegex = /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/;

    constructor(private apiKey: string) {
        if (!this.apiKeyRegex.test(apiKey)) {
            throw new Error('Invalid API Key');
        }

        fetch(`https://todite.now.sh/api/v1/user?api_key=${this.apiKey}`)
            .then(res => res.json())
            .then((user: {
                error?: ApiError;
            }) => {
                if (user.error) {
                    throw new Error(user.error.message);
                }
            });
    }

    public async create({ name, completed, date }: Todo): Promise<Todo> {
        const data: Todo & {
            error?: ApiError;
        } = await fetch(`https://todite.now.sh/api/v1/todos?api_key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, completed, date })
        }).then(res => res.json());

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.date) data.date = new Date(data.date);

        // Return the object like this so that `__v` isn't included (if you know a cleaner way to do this, feel free to submit a PR :D)
        return { _id: data._id, name: data.name, completed: data.completed, user: data.user, date: data.date };
    }

    public async getAll(): Promise<Todo[]> {
        const data: Todo[] & {
            error?: ApiError;
        } = await fetch(`https://todite.now.sh/api/v1/todos?api_key=${this.apiKey}`).then(res => res.json());

        if (data.error) {
            throw new Error(data.error.message);
        }

        data.forEach(todo => {
            if (todo.date) todo.date = new Date(todo.date);
        });

        // Return the array like this so that `__v` isn't included (if you know a cleaner way to do this, feel free to submit a PR :D)
        return data.map(todo => ({ _id: todo._id, name: todo.name, completed: todo.completed, user: todo.user, date: todo.date }));
    }

    public async get(id: string): Promise<Todo> {
        const data: Todo & {
            error?: ApiError;
        } = await fetch(`https://todite.now.sh/api/v1/todo/${id}?api_key=${this.apiKey}`).then(res => res.json());

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.date) data.date = new Date(data.date);

        // Return the object like this so that `__v` isn't included (if you know a cleaner way to do this, feel free to submit a PR :D)
        return { _id: data._id, name: data.name, completed: data.completed, user: data.user, date: data.date };
    }

    // Disable linting for function override
    // eslint-disable-next-line
    public update(newTodoData: PartialTodo & { id: string; }): Promise<Todo>;
    // Disable linting for function override
    // eslint-disable-next-line
    public update(id: string, name?: string, completed?: boolean, date?: Date): Promise<Todo>;
    public async update(newTodoDataOrId: (PartialTodo & { id: string; }) | string, name?: string, completed?: boolean, date?: Date): Promise<Todo> {
        let id: string;
        if (typeof newTodoDataOrId === 'string') {
            id = newTodoDataOrId;
        } else {
            if (!newTodoDataOrId.id && !newTodoDataOrId._id) throw new Error('id must be passed in as an argument');
            
            // At least one of these will always be defined
            // eslint-disable-next-line
            id = newTodoDataOrId.id || newTodoDataOrId._id!;

            if (!name) name = newTodoDataOrId.name;
            if (!completed) completed = newTodoDataOrId.completed;
            if (!date) date = newTodoDataOrId.date;
        }

        const data: Todo & {
            error?: ApiError;
        } = await fetch(`https://todite.now.sh/api/v1/todo/${id}?api_key=${this.apiKey}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, completed, date })
        }).then(res => res.json());

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.date) data.date = new Date(data.date);

        // Return the object like this so that `__v` isn't included (if you know a cleaner way to do this, feel free to submit a PR :D)
        return { _id: data._id, name: data.name, completed: data.completed, user: data.user, date: data.date };
    }

    public async delete(id: string): Promise<void> {
        const data: {
            success?: true;
            error?: ApiError;
        } = await fetch(`https://todite.now.sh/api/v1/todo/${id}?api_key=${this.apiKey}`, {
            method: 'DELETE'
        }).then(res => res.json());

        if (!data.success) {
            throw new Error(data.error?.message);
        }
    }
}
