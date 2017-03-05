import {expect, spy, restore} from '../test';
import Events from '../../src/lib/Events.js';

describe('Events', function() {

  let events;

  beforeEach(function() {
    events = new Events();
  });

  afterEach(restore);

  it('notifies registered listener', function() {
    let listener = spy();
    events.on('foo', listener);

    events.trigger('foo');

    expect(listener).to.have.been.called;
  });

  it('passes parameter to listener', function() {
    let listener = spy();
    events.on('foo', listener);

    events.trigger('foo', 'bar');

    expect(listener).to.have.been.calledWith('bar');
  });

  it('does not register same listener twice', function() {
    let listener = spy();
    events.on('foo', listener);
    events.on('foo', listener);

    events.trigger('foo');

    expect(listener).to.have.been.calledOnce;
  });

  it('does not affect listeners for other types', function() {
    let listener = spy();
    events.on('bar', listener);

    events.trigger('foo');

    expect(listener).to.not.have.been.called;
  });

  it('removes registered listener', function() {
    let listener = spy();
    events.on('foo', listener);
    events.off('foo', listener);

    events.trigger('foo');

    expect(listener).to.not.have.been.called;
  });

  it('does not remove listeners for other types', function() {
    let listener = spy();
    events.on('foo', listener);
    events.on('bar', listener);
    events.off('bar', listener);

    events.trigger('foo');

    expect(listener).to.have.been.called;
  });

  it('can remove listener during notify', function() {
    let listener2 = spy();
    let listener1 = spy(() => events.off('foo', listener2));
    events.on('foo', listener1);
    events.on('foo', listener2);

    events.trigger('foo');
    events.trigger('foo');

    // Listener 2 is removed on first event, but still called for this event.
    expect(listener2).to.have.been.calledOnce;
  });

});
