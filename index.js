'use strict';
const inquirer = require('inquirer');
const chalkPipe = require('chalk-pipe');
const FoodTruckData = require('./lib/foodtruckdata');

const message = [
  'Enter one of the following:',
  'n - show next page',
  // 'p - show previous page',
  // 'q - quit',
  ''
].join('\n');


// inquirer.prompt(questions).then(answers => {
//   console.log(JSON.stringify(answers, null, '  '));
// });

(async () => {

  try {
    let foodTruckData = new FoodTruckData();
    await foodTruckData.init();
    let exit = false;


    let questions = [{
      type: 'input',
      name: 'show more',
      message: foodTruckData.next() + '\n' + message,
      validate: (value) => {
        if (value === 'q') return true;
        if (value === 'n') {
          return foodTruckData.next();
        } else if (value === 'p') {
          return foodTruckData.prev();
        }
        return false;
      }
    }];

    await inquirer.prompt(questions);

    console.log('hello');
  } catch (error) {
    throw error;
  }
})();
