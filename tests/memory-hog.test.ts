import MemoryHog from '../src/memory-hog';

test('Can fill the memory', () => {
  return MemoryHog(10000);
})