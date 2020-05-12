import * as Hapi from '@hapi/hapi';
import Server from '../src/server';

test('Server default PORT', () => {
  expect(Server.info.port).toBe(3000);
});