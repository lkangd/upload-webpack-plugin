import main from '../index';
import circularA from './circularA';

circularA('execute in circularB');

console.log('main :>> ', main);

export default function circularB(msg) {
  console.log('circularB :>> ', msg);
}
