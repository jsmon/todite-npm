import fetch from 'node-fetch';

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

        fetch(`http://localhost:3000/api/v1/user?api_key=${this.apiKey}`)
            .then(res => res.json())
            .then((user: {
                error?: ApiError;
            }) => {
                if (user.error) {
                    throw new Error(user.error.message);
                }
            });
    }
}
