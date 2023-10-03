import { AuthorsFormatPipe } from './authors-format.pipe';

describe('AuthorsFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new AuthorsFormatPipe();
    expect(pipe).toBeTruthy();
  });
});
