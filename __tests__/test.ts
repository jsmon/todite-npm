import ToditeTypes from '..';

// Using the `require` function so TypeScript doesn't tell us '`../dist/index.min.js` doesn't exist'

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-var-requires
const Todite: new (apiKey: string) => ToditeTypes = require('../dist/index.min.js');

// This is the API Key of the test to-do
const todite = new Todite('00000000-0000-0000-0000-000000000000');

test('The todos return the correct values', async () => {
    const now = new Date();

    // Use `Promise.all()` so that it runs all the async functions at the same time, making it takes as little time as possible
    // Read about it here if you want
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
    const [todos, todo, newTodo, updatedTodo] = await Promise.all([
        todite.getAll(),
        todite.get('6036a61586b0c2034777ec5f'),
        todite.create({ name: 'Pass all tests', completed: false, date: now }),
        todite.update({ id: '60369fea86b0c2034777ec5d', name: 'idk', completed: false })
    ]);

    expect(todos[0]).toStrictEqual({
        _id: '60369fea86b0c2034777ec5d',
        name: 'Hello',
        completed: false,
        user: '0000000000000000000000000000',
        date: new Date(2038, 0, 19, 3, 14, 7)
    });
    expect(todo).toStrictEqual({
        _id: '6036a61586b0c2034777ec5f',
        name: 'Goodbye',
        completed: true,
        user: '0000000000000000000000000000',
        date: new Date(2021, 3, 3, 10, 57)
    });
    expect(newTodo).toStrictEqual({
        _id: expect.any(String),
        name: 'Pass all tests',
        completed: false,
        user: '0000000000000000000000000000',
        date: now
    });
    expect(updatedTodo).toStrictEqual({
        _id: '60369fea86b0c2034777ec5d',
        name: 'idk',
        completed: false,
        user: '0000000000000000000000000000',
        date: new Date(2038, 0, 19, 3, 14, 7)
    });
});
