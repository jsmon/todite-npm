#!/usr/bin/env node

import ToditeTypes from '..';

// Using the `require` function so TypeScript doesn't tell us '`./index.min.js` doesn't exist'
// eslint-disable-next-line
const Todite: new (apiKey: string) => ToditeTypes = require(`${__dirname}/index.min.js`);

import { Command, OptionValues } from 'commander';

// Make the to-dos have good human readable table headings
interface FormattedTodo {
    ID: string;
    Name: string;
    Completed: '✓' | '×';
    'Firebase User ID': string;
    'Done by': string;
}

const program = new Command();

program
    .version('0.1.1', '-v, --version')
    .name('todite');

program
    .command('get-all')
    .description('Get all to-dos')
    .requiredOption('-a, --api-key <api-key>', 'Your Todite API Key [REQUIRED]')
    .action(async (options: OptionValues) => {
        try {
            const apiKey: string = options.apiKey;
            const todite = new Todite(apiKey);

            const todos = await todite.getAll();

            const formattedTodos: FormattedTodo[] = todos.map(todo => {
                const completed = todo.completed ? '✓' : '×';
                const date = todo.date?.toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' }) || 'Whenever';

                return { ID: todo._id, Name: todo.name, Completed: completed, 'Firebase User ID': todo.user, 'Done by': date };
            });

            console.table(formattedTodos);
        } catch (err) {
            console.error(err.message);

            process.exit(1);
        }
    });

program
    .command('get')
    .description('Get one to-do')
    .requiredOption('-a, --api-key <api-key>', 'Your Todite API Key [REQUIRED]')
    .requiredOption('-id, --todo-id <todo-id>', 'The To-do ID [REQUIRED]')
    .action(async (options: OptionValues) => {
        try {
            const apiKey: string = options.apiKey;
            const id: string = options.todoId;
            const todite = new Todite(apiKey);

            const todo = await todite.get(id);

            if (!todo) {
                console.log('Could not find to-do with that ID.');
                return;
            }

            const formattedCompleted = todo.completed ? '✓' : '×';
            const formettedDate = todo.date?.toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' }) || 'Whenever';

            const formattedTodo: FormattedTodo = { ID: todo._id, Name: todo.name, Completed: formattedCompleted, 'Firebase User ID': todo.user, 'Done by': formettedDate };

            // Put it into an array for nicer formatting
            console.table([formattedTodo]);
        } catch (err) {
            console.error(err.message);

            process.exit(1);
        }
    });

program
    .command('update')
    .description('Update a to-do')
    .requiredOption('-a, --api-key <api-key>', 'Your Todite API Key [REQUIRED]')
    .requiredOption('-id, --todo-id <todo-id>', 'The To-do ID [REQUIRED]')
    .option('-n, --name <name>', 'The To-dos updated name')
    .option('-c, --completed [completed]', 'Whether the updated to-do should be completed', undefined)
    .option('-d, --date <date>', 'The to-dos updated date (in ISO format)')
    .action(async (options: OptionValues) => {
        try {
            const apiKey: string = options.apiKey;
            const id: string = options.todoId;
            
            const todite = new Todite(apiKey);
            const todo = await todite.get(id);

            if (!todo) {
                console.log('Could not find to-do with that ID.');
                return;
            }

            const newName: string = options.name || todo.name;
            const newDate = new Date(options.date || todo.date);

            let newCompleted: boolean;

            if (options.completed) {
                if (options.completed === 'true' || options.completed === true) newCompleted = true;
                else if (options.completed === 'false' || options.completed === false) newCompleted = false;
                else newCompleted = todo.completed;
            } else {
                newCompleted = todo.completed;
            }

            const updatedTodo = await todite.update({
                id,
                name: newName,
                completed: newCompleted,
                date: newDate
            });

            const formattedCompleted = updatedTodo.completed ? '✓' : '×';
            const formettedDate = updatedTodo.date?.toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' }) || 'Whenever';

            const formattedTodo: FormattedTodo = { ID: updatedTodo._id, Name: updatedTodo.name, Completed: formattedCompleted, 'Firebase User ID': updatedTodo.user, 'Done by': formettedDate };

            // Put it into an array for nicer formatting
            console.table([formattedTodo]);
        } catch (err) {
            console.error(err.message);

            process.exit(1);
        }
    });

program
    .command('delete')
    .description('Delete a to-do')
    .requiredOption('-a, --api-key <api-key>', 'Your Todite API Key [REQUIRED]')
    .requiredOption('-id, --todo-id <todo-id>', 'The To-do ID [REQUIRED]')
    .action(async (options: OptionValues) => {
        try {
            const apiKey: string = options.apiKey;
            const id: string = options.todoId;
            
            const todite = new Todite(apiKey);

            await todite.delete(id);

            console.log('To-do successfully deleted');
        } catch (err) {
            console.error(err.message);

            process.exit(1);
        }
    });

program
    .command('create')
    .description('Create a new to-do')
    .requiredOption('-a, --api-key <api-key>', 'Your Todite API Key [REQUIRED]')
    .requiredOption('-n, --name <name>', 'The To-dos name [REQUIRED]')
    .option('-c, --completed [completed]', 'Whether the to-do should be completed', undefined)
    .option('-d, --date <date>', 'When the to-do needs to be done by (in ISO format)')
    .action(async (options: OptionValues) => {
        try {
            const apiKey: string = options.apiKey;
            const name: string = options.name;
            
            
            const date = options.date ? new Date(options.date) : undefined;
            
            let completed = false;
            if (options.completed) {
                if (options.completed === 'true' || options.completed === true) completed = true;
                else if (options.completed === 'false' || options.completed === false) completed = false;
                else completed = false;
            }

            const todite = new Todite(apiKey);
            const todo = await todite.create({
                name,
                completed,
                date
            });

            const formattedCompleted = todo.completed ? '✓' : '×';
            const formettedDate = todo.date?.toLocaleDateString('en-GB', { hour: '2-digit', minute: '2-digit' }) || 'Whenever';

            const formattedTodo: FormattedTodo = { ID: todo._id, Name: todo.name, Completed: formattedCompleted, 'Firebase User ID': todo.user, 'Done by': formettedDate };

            // Put it into an array for nicer formatting
            console.table([formattedTodo]);
        } catch (err) {
            console.error(err.message);

            process.exit(1);
        }
    });

program.parse(process.argv);
