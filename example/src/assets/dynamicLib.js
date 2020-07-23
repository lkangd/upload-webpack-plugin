/* eslint-disable no-console */
import './dynamic.css';
const content = 'dynamic lib';
console.log(content);
import(/* webpackChunkName: "dynamicInDynamic" */ './dynamicInDynamicLib').then(content => {
  console.log('dynamic in dynamic content loaded :>> ', content);
});
export default content;
