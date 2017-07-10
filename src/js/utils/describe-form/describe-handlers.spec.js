import describeHandlers from './describe-handlers';

describe('describe handlers', () => {
  it('returns a function which returns handlers', () => {
    const cb = jest.fn();
    const handlersDescr = describeHandlers(['firstname', 'lastname']);
    const handlers = handlersDescr(cb);
    handlers.firstname('bobby');
    expect(cb).toHaveBeenCalledWith({ firstname: 'bobby' });
  });
});
