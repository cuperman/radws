#!/usr/bin/env node

const path = require('path');
const inquirer = require('inquirer');
const config = require('../util/config');
const { CONFIG_FILE } = require('../util/constants');

const APP_NAME = 'app_name';
const AWS_PROFILE = 'aws_profile';
const S3_BUCKET = 's3_bucket';
const STACK_NAME = 'stack_name';

const DEFAULT_APP_NAME = path.basename(process.cwd());
const DEFAULT_AWS_PROFILE = 'default';
const DEFAULT_S3_BUCKET = 'my-bucket';
const DEFAULT_STACK_NAME = DEFAULT_APP_NAME;

function configWizard(base = {}) {
  return new Promise(resolve => {
    inquirer.prompt([{
      type: 'input',
      name: APP_NAME,
      message: 'Application name',
      default: DEFAULT_APP_NAME,
      when: () => !base[APP_NAME]
    }, {
      type: 'input',
      name: AWS_PROFILE,
      message: 'AWS profile for CLI',
      default: DEFAULT_AWS_PROFILE,
      when: () => !base[AWS_PROFILE]
    }, {
      type: 'input',
      name: S3_BUCKET,
      message: 'S3 bucket to upload package',
      default: DEFAULT_S3_BUCKET,
      when: () => !base[S3_BUCKET]
    }, {
      type: 'input',
      name: STACK_NAME,
      message: 'Cloudformation stack name',
      default: DEFAULT_STACK_NAME,
      when: () => !base[STACK_NAME]
    }]).then(answers => {
      resolve(Object.assign({}, base, answers));
    });
  });
}

module.exports = function() {
  return new Promise((resolve, reject) => {
    if (config.exists(CONFIG_FILE)) {
      reject({ message: `Already initialized: ${CONFIG_FILE}` });
    }

    configWizard()
      .then(answers => {
        config.write(CONFIG_FILE, answers);
        resolve({ message: `Initalized file: ${CONFIG_FILE}` });
      })
      .catch(() => reject(`Failed to initialize config file: ${CONFIG_FILE}`));
  });
};
