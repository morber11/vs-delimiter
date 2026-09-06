import * as assert from 'assert';
import { getDelimitedText, getWrappedText, wrapAndDelimitText } from '../../lib/transform';

suite('transform', () => {
    test('getDelimitedText adds delimiters between words', () => {
        assert.strictEqual(getDelimitedText('a b c', ','), 'a, b, c');
    });

    test('getDelimitedText preserves multiple spaces', () => {
        assert.strictEqual(getDelimitedText('a  b', ','), 'a,  b');
    });

    test('getDelimitedText preserves empty lines and multiline text', () => {
        assert.strictEqual(getDelimitedText('a b\nc d', ','), 'a, b\nc, d');
    });

    test('getWrappedText wraps each word and preserves spacing', () => {
        assert.strictEqual(getWrappedText("a  b", "'"), "'a'  'b'");
    });

    test('wrapAndDelimitText wraps and delimits text', () => {
        assert.strictEqual(wrapAndDelimitText('a b', ',', "'"), "'a', 'b'");
    });

    test('getDelimitedText preserves tabs and spaces', () => {
        assert.strictEqual(getDelimitedText('a\tb', ','), "a,\tb");
    });

    test('getWrappedText preserves tabs', () => {
        assert.strictEqual(getWrappedText('a\tb', '"'), '"a"\t"b"');
    });

    test('getDelimitedText preserves trailing spaces on a line', () => {
        assert.strictEqual(getDelimitedText('a b ', ','), 'a, b ');
    });

    test('empty input returns empty string', () => {
        assert.strictEqual(getDelimitedText('', ','), '');
        assert.strictEqual(getWrappedText('', "'"), '');
        assert.strictEqual(wrapAndDelimitText('', ',', "'"), '');
    });

    test('getDelimitedText returns single word unchanged', () => {
        assert.strictEqual(getDelimitedText('hello', ','), 'hello');
    });

    test('getWrappedText wraps single word', () => {
        assert.strictEqual(getWrappedText('hello', "'"), "'hello'");
    });

    test('getDelimitedText preserves all-whitespace input', () => {
        assert.strictEqual(getDelimitedText('   ', ','), '   ');
    });

    test('getWrappedText preserves all-whitespace input', () => {
        assert.strictEqual(getWrappedText('   ', "'"), '   ');
    });

    test('getDelimitedText handles empty delimiter', () => {
        assert.strictEqual(getDelimitedText('a b', ''), 'a b');
    });

    test('getWrappedText handles empty wrapper', () => {
        assert.strictEqual(getWrappedText('a b', ''), 'a b');
    });

    test('wrapAndDelimitText handles multiline input', () => {
        assert.strictEqual(wrapAndDelimitText('a b\nc d', ',', "'"), "'a', 'b'\n'c', 'd'");
    });

    test('wrapAndDelimitText preserves CRLF line endings', () => {
        assert.strictEqual(wrapAndDelimitText('a b\r\nc d', ',', "'"), "'a', 'b'\r\n'c', 'd'");
    });
});
