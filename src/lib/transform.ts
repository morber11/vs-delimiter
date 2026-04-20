const LINE_BREAK_REGEX = /\r?\n/;
const WHITESPACE_REGEX = /^(\s+)$/;

function isWhitespace(token: string): boolean {
    return WHITESPACE_REGEX.test(token);
}

export function getDelimitedText(text: string, delimiter: string): string {
    return text
        .split(LINE_BREAK_REGEX)
        .map(line => {
            const tokens = line.split(/(\s+)/);
            const processed = tokens.map(token =>
                token.length === 0 || isWhitespace(token) ? token : `${token}${delimiter}`
            );

            if (delimiter && tokens.length > 0) {
                let lastWordIndex = -1;

                for (let index = 0; index < tokens.length; index += 1) {
                    const token = tokens[index];
                    if (token.length > 0 && !isWhitespace(token)) {
                        lastWordIndex = index;
                    }
                }

                if (lastWordIndex >= 0) {
                    const last = processed[lastWordIndex];
                    processed[lastWordIndex] = last.slice(0, -delimiter.length);
                }
            }

            return processed.join('');
        })
        .join('\n');
}

export function getWrappedText(text: string, wrapper: string): string {
    return text
        .split(LINE_BREAK_REGEX)
        .map(line =>
            line
                .split(/(\s+)/)
                .map(token =>
                    token.length > 0 && !isWhitespace(token)
                        ? `${wrapper}${token}${wrapper}`
                        : token
                )
                .join('')
        )
        .join('\n');
}

export function wrapAndDelimitText(text: string, delimiter: string, wrapper: string): string {
    return getDelimitedText(getWrappedText(text, wrapper), delimiter);
}
