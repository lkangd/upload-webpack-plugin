import _ from 'lodash';
import Vue from 'vue';

import './assets/common.css';
import './assets/index.css';
import normalLib from './assets/normalLib';
// import circularA from './assets/circularA';
// import circularB from './assets/circularB';
import sub from './sub';

const imgGif = require('./assets/img/happy-boy.gif');
const othersTxt = require('./assets/others/example.txt');
const othersZip = require('./assets/others/example.zip');
const example = { content: 'example', normalLib, imgGif, othersTxt, othersZip };

import(/* webpackChunkName: "dynamic" */ './assets/dynamicLib').then(content => {
  console.log('dynamic content loaded :>> ', content);
});

console.log('main console sub :>>', sub);

new Vue();

// circularA('execute in main');
// circularB('execute in main');

console.log('example :>> ', _.cloneDeep(example));

export default example;
