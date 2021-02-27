#!/usr/bin/env node

import ToditeTypes from '..';

// Using the `require` function so TypeScript doesn't tell us '`./index.min.js` doesn't exist'
// eslint-disable-next-line
const Todite: new (apiKey: string) => ToditeTypes = require(`${__dirname}/index.min.js`);

import { Command } from 'commander';

const program = new Command();

program.version('0.1.0', '-v, --version');
