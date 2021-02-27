import fetch from 'node-fetch';

import { Todo } from '..';

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
}
