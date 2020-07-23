import _ from 'lodash';
import Vue from 'vue';

import './assets/common.css';
import './assets/sub.css';
import normalLib from './assets/normalLib';
// import circularA from './assets/circularA';
// import circularB from './assets/circularB';
import main from './index';

const imgGif = require('./assets/img/happy-boy.gif');
const othersTxt = require('./assets/others/example.txt');
const othersZip = require('./assets/others/example.zip');
const example = { content: 'example', normalLib, imgGif, othersTxt, othersZip };

import(/* webpackChunkName: "dynamicSub" */ './assets/dynamicLibSub').then(content => {
  console.log('dynamic sub content loaded :>> ', content);
});

console.log('sub console main :>>', main);

new Vue();

// circularA('execute in sub');
// circularB('execute in sub');

console.log('example :>> ', _.cloneDeep(example));

export default example;
