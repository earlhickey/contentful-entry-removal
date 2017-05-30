#!/usr/bin/env node

const contentful = require('contentful-management');
const fs = require('fs');

const argv = require('yargs')
  .default('interval', 5000)
  .default('maxAmount', 10)
  .describe('managementToken', 'Mangment token to space API')
  .describe('space', 'Space id to work with')
  .describe('maxAmount', 'Contentul API limit')
  .describe('interval', 'Contentful API calls timeout')
  .describe('config', 'Configuration json file path')
  .usage('Usage: $0 --config [file]')
  .demandOption(['config'])
  .config('config', configPath => JSON.parse(fs.readFileSync(configPath, 'utf-8')))
  .argv;

const config = {
  managementToken: argv.managementToken,
  space: argv.space,
  interval: argv.interval,
  maxAmount: argv.maxAmount,
};

console.log('Connecting to Contentful');
const client = contentful.createClient({
  accessToken: config.managementToken,
});


client.getSpace(config.space)
  .then((space) => space.getEntries({
    limit: config.maxAmount,
  }))
  .then((response) => {
    console.log('Extracted: ', response.limit);
    console.log('Total entries: ', response.total);
    return deleteEntry(response.items.shift(), response.items);
  })
  .then(() => console.log('Your space is clean!'))
  .catch(console.error);

function deleteEntry(entry, list) {
  const identifier = entry.sys.id;
  console.log('---Deleting entry:', identifier);

  return entry.delete()
    .then((err) => {
      console.log('list: ', list);
      console.log('Entry deleted: ', identifier, err || '');
      if (err) {
        return Promise.reject();
      }

      if (list.length === 0) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(deleteEntry(list.shift(), list));
        }, config.interval);
      });
    })
    .catch((error) => {
      console.log('Failed to delete entry: ', identifier);
      console.log(error);
      return Promise.reject();
    });
}
