import circularB from './circularB';

circularB('execute in circularA');

export default function circularA(msg) {
  console.log('circularA :>> ', msg);
}
