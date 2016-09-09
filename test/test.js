import chai, {expect} from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import fetchMock from 'fetch-mock';

chai.use(sinonChai);

let sandbox = sinon.sandbox.create();
let spy = sandbox.spy.bind(sandbox);
let stub = sandbox.stub.bind(sandbox);
let fetch_mock = fetchMock.mock.bind(fetchMock);

export {expect, spy, stub, fetch_mock, restore};

function restore() {
  sandbox.restore();
  fetchMock.restore();
}
