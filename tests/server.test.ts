import * as Hapi from '@hapi/hapi';
import Server from '../src/server';

test('Server default HOST & PORT', () => {
  expect(Server.info.port).toBe(3000);
  expect(Server.info.host).toBe('localhost');
});