import * as test from 'tape';
import * as sinon from 'sinon';
import { Emitter } from '../src/emitter';

// Derived target class using stubbed inner add/remove
class EmitterTarget extends Emitter {
  addListenerStub: sinon.SinonStub = sinon.stub();
  removeListenerStub: sinon.SinonStub = sinon.stub();

  innerAddEventListener(event: string, listener: (...args: any[]) => void) {
    this.addListenerStub(event, listener);
  }
  innerRemoveEventListener(event: string, listener: (...args: any[]) => void) {
    this.removeListenerStub(event, listener);
  }
}

test('Emitter emit without listeners does nothing', t => {
  const target = new EmitterTarget();
  const listener = sinon.stub();
  target.addListener('otherevent', listener);

  target.emit('testevent', { test: 'test-data' });

  t.assert(listener.notCalled, 'should not have called listener');
  t.end();
});

test('Emitter addListener with multiple listeners emit calls each matching listener', t => {
  const target = new EmitterTarget();
  const listener1 = sinon.stub();
  const listener2 = sinon.stub();
  const listener3 = sinon.stub();
  target.addListener('testevent', listener1);
  target.addListener('otherevent', listener2);
  target.addListener('testevent', listener3);

  target.emit('testevent', { test: 'test-data' });

  t.assert(listener1.calledWith({ test: 'test-data' }), 'should have called first listener');
  t.assert(listener2.notCalled, 'should not have called second listener');
  t.assert(listener3.calledWith({ test: 'test-data' }), 'should have called third listener');
  t.end();
});

test('Emitter addListener calls innerAddEventListener', t => {
  const target = new EmitterTarget();
  const listener = sinon.stub();

  target.addListener('testevent', listener);

  t.assert(target.addListenerStub.calledWith('testevent', listener),
      'should have called innerAddEventListener');
  t.assert(target.removeListenerStub.notCalled,
      'should not have called innerRemoveEventListener');
  t.end();
});

test('Emitter on calls innerAddEventListener', t => {
  const target = new EmitterTarget();
  const listener = sinon.stub();

  target.on('testevent', listener);

  t.assert(target.addListenerStub.calledWith('testevent', listener),
      'should have called innerAddEventListener');
  t.assert(target.removeListenerStub.notCalled,
      'should not have called innerRemoveEventListener');
  t.end();
});

test('Emitter eventNames returns listened to events', t => {
  const target = new EmitterTarget();
  const stub = sinon.stub();

  target.addListener('testevent1', sinon.stub());
  target.addListener('testevent2', stub);
  target.addListener('testevent3', sinon.stub());
  target.removeListener('testevent2', stub);

  const result = target.eventNames();

  t.deepEqual(result, ['testevent1', 'testevent3']);
  t.end();
});

test('Emitter listenerCount returns active listener count', t => {
  const target = new EmitterTarget();
  const stub = sinon.stub();

  target.addListener('testevent', sinon.stub());
  target.addListener('testevent', stub);
  target.addListener('testevent', sinon.stub());
  target.removeListener('testevent', stub);

  const result = target.listenerCount('testevent');

  t.deepEqual(result, 2);
  t.end();
});

test('Emitter listenerCount returns active listener count', t => {
  const target = new EmitterTarget();
  const stub1 = sinon.stub();
  const stub2 = sinon.stub();
  const stub3 = sinon.stub();

  target.addListener('testevent', stub1);
  target.addListener('testevent', stub2);
  target.addListener('testevent', stub3);
  target.removeListener('testevent', stub2);

  const result = target.listeners('testevent');

  t.deepEqual(result, [stub1, stub3]);
  t.end();
});

test('Emitter once calls listener once only', t => {
  const target = new EmitterTarget();
  const stub = sinon.stub();

  target.once('testevent', stub);
  t.equal(target.listenerCount('testevent'), 1, 'should have 1 listener');

  target.emit('testevent');

  t.assert(stub.calledOnce, 'should have called listener once');
  t.equal(target.listenerCount('testevent'), 0, 'should have no listeners');

  target.emit('testevent');
  t.assert(stub.calledOnce, 'should not have called listener twice');

  t.end();
});

test('Emitter removeListener should not call listener again', t => {
  const target = new EmitterTarget();
  const stub1 = sinon.stub();
  const stub2 = sinon.stub();

  target.addListener('testevent', stub1);
  target.addListener('testevent', stub2);
  target.removeListener('testevent', stub2);

  target.emit('testevent');

  t.assert(stub1.calledOnce, 'should have called first listener');
  t.assert(stub2.notCalled, 'should not have called second listener');
  t.end();
});

test('Emitter removeListener calls innerRemoveEventListener', t => {
  const target = new EmitterTarget();
  const listener = sinon.stub();

  target.addListener('testevent', listener);
  target.addListenerStub.reset();

  target.removeListener('testevent', listener);

  t.assert(target.addListenerStub.notCalled,
      'should not have called innerAddEventListener');
  t.assert(target.removeListenerStub.calledWith('testevent', listener),
      'should have called innerRemoveEventListener');
  t.end();
});

test('Emitter removeAllListeners with eventName removes all listeners for event', t => {
  const target = new EmitterTarget();
  const stub1 = sinon.stub();
  const stub2 = sinon.stub();
  const stub3 = sinon.stub();

  target.addListener('testevent1', stub1);
  target.addListener('testevent2', stub2);
  target.addListener('testevent2', stub3);

  target.removeAllListeners('testevent2');

  t.deepEqual(target.eventNames(), ['testevent1']);

  target.emit('testevent1');
  target.emit('testevent2');

  t.assert(stub1.called, 'should have called first listener');
  t.assert(stub2.notCalled, 'should not have called second listener');
  t.assert(stub3.notCalled, 'should not have called third listener');

  t.end();
});

test('Emitter removeAllListeners without eventName removes all listeners for all events', t => {
  const target = new EmitterTarget();
  const stub1 = sinon.stub();
  const stub2 = sinon.stub();
  const stub3 = sinon.stub();

  target.addListener('testevent1', stub1);
  target.addListener('testevent2', stub2);
  target.addListener('testevent2', stub3);

  target.removeAllListeners();

  t.deepEqual(target.eventNames(), []);

  target.emit('testevent1');
  target.emit('testevent2');

  t.assert(stub1.notCalled, 'should not have called first listener');
  t.assert(stub2.notCalled, 'should not have called second listener');
  t.assert(stub3.notCalled, 'should not have called third listener');

  t.end();
});
