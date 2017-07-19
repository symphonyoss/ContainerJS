import * as test from 'tape';
import * as sinon from 'sinon';
import { globals } from './globals';
import { Display } from '../src/display';

const getDisplaysStub = sinon.stub();
const ssf = {
  Screen: {
    getDisplays: getDisplaysStub
  }
};

test('Display getDisplayAlteredPosition without displayId returns undefined x/y', t => {
  globals({ ssf });

  Display.getDisplayAlteredPosition(undefined, { x: 10, y: 50 }).then(result => {
    t.deepEqual(result, { x: undefined, y: undefined });

    t.end();
  });
});

test('Display getDisplayAlteredPosition with known displayId returns x/y within display', t => {
  globals({ ssf });

  const displays = [
    { id: 'screen-100', bounds: { x: 0, y: 0 } },
    { id: 'screen-101', bounds: { x: 100, y: 100 } }
  ];
  getDisplaysStub.returns(Promise.resolve(displays));

  Display.getDisplayAlteredPosition('screen-101', { x: 10, y: 50 }).then(result => {
    t.deepEqual(result, { x: 110, y: 150 });

    t.end();
  });
});
