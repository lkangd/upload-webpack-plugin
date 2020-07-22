import Spinner from '../../src/helpers/spinner';
const ora = require('ora');

describe('helpers:spinner', () => {
  test('should instantiate the "Spinner" correctly', () => {
    const spinner = new Spinner({ prefixText: 'upload-webpack-plugin' });
    expect(spinner).toBeInstanceOf(Spinner);
    expect(spinner.options).toEqual({ prefixText: 'upload-webpack-plugin' });
    expect(spinner.fileCount).toBe(0);
    expect(spinner.uploading).toBe(0);
    expect(spinner.uploadedFiles).toEqual({});
    expect(spinner.delRecords).toEqual({});
    expect(typeof spinner.start).toBe('function');
    expect(typeof spinner.end).toBe('function');
    expect(typeof spinner.handleOver).toBe('function');
    expect(typeof spinner.setFileCount).toBe('function');
    expect(typeof spinner.delCount).toBe('function');
  });
  test('should start spinner with offered "text', () => {
    const spinner = new Spinner();
    spinner.setFileCount(100);
    spinner.start('foo.ext');
    expect(spinner.spinner).toBeInstanceOf(Object.getPrototypeOf(ora()).constructor);
    expect(spinner.spinner.text).toContain('foo.ext');
    expect(spinner.uploading).toBe(1);
    spinner.start('bar.ext');
    expect(spinner.spinner.text).toContain('bar.ext');
    expect(spinner.uploading).toBe(2);
  });
  test('should end spinner and record offered filename', () => {
    const spinner = new Spinner();
    spinner.handleOver = jest.fn();
    spinner.setFileCount(100);
    spinner.start('foo');
    spinner.start('bar');
    spinner.end('foo', 'http://cdn.test.com/foo');
    spinner.end('bar', 'http://cdn.test.com/bar');
    expect(spinner.uploadedFiles).toHaveProperty('foo', 'http://cdn.test.com/foo');
    expect(spinner.uploadedFiles).toHaveProperty('bar', 'http://cdn.test.com/bar');
    expect(spinner.handleOver).toHaveBeenCalledTimes(2);
  });
  test('should handle over when all upload is ended', () => {
    const spinner = new Spinner();
    spinner.setFileCount(2);
    spinner.start('foo');
    spinner.start('bar');
    spinner.end('foo', 'http://cdn.test.com/foo');
    spinner.end('bar');
    const { length } = Object.keys(spinner.uploadedFiles);
    expect(spinner.fileCount).toBe(length);
  });
  test('should set new fileCount', () => {
    const spinner = new Spinner();
    expect(spinner.fileCount).toBe(0);
    spinner.setFileCount(100);
    expect(spinner.fileCount).toBe(100);
  });
  test('should reduce fileCount and record the deleted filename', () => {
    const spinner = new Spinner();
    spinner.handleOver = jest.fn();
    spinner.setFileCount(100);
    spinner.delCount('foo.ext');
    expect(spinner.fileCount).toBe(99);
    expect(spinner.delRecords['foo.ext']).toBeTruthy();
    expect(spinner.handleOver).toHaveBeenCalled();
    spinner.delCount('foo.ext');
    expect(spinner.fileCount).toBe(99);
    expect(spinner.delRecords['foo.ext']).toBeTruthy();
    expect(spinner.handleOver).toHaveBeenCalledTimes(1);
  });
});
