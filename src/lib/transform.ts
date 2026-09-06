const LINE_BREAK_REGEX = /(\r?\n)/;
const WHITESPACE_REGEX = /^(\s+)$/;
const TOKEN_SEPARATOR_REGEX = /(\s+)/;

type WordTransformer = (word: string, isLastWord: boolean) => string;

function isWhitespace(token: string): boolean {
    return WHITESPACE_REGEX.test(token);
}

function isLineBreak(part: string): boolean {
    return part === '\n' || part === '\r\n';
}

function transformWords(text: string, transformWord: WordTransformer): string {
    return text
        .split(LINE_BREAK_REGEX)
        .map(part => {
            if (isLineBreak(part)) {
                return part;
            }

            const tokens = part.split(TOKEN_SEPARATOR_REGEX);
            let lastWordIndex = -1;

            for (let tokenIndex = tokens.length - 1; tokenIndex >= 0; tokenIndex -= 1) {
                const token = tokens[tokenIndex];
                if (token.length > 0 && !isWhitespace(token)) {
                    lastWordIndex = tokenIndex;
                    break;
                }
            }

            return tokens
                .map((token, tokenIndex) =>
                    token.length === 0 || isWhitespace(token)
                        ? token
                        : transformWord(token, tokenIndex === lastWordIndex)
                )
                .join('');
        })
        .join('');
}

export function getDelimitedText(text: string, delimiter: string): string {
    return transformWords(text, (word, isLastWord) =>
        delimiter && !isLastWord ? `${word}${delimiter}` : word
    );
}

export function getWrappedText(text: string, wrapper: string): string {
    return transformWords(text, word => `${wrapper}${word}${wrapper}`);
}

export function wrapAndDelimitText(text: string, delimiter: string, wrapper: string): string {
    return getDelimitedText(getWrappedText(text, wrapper), delimiter);
}
