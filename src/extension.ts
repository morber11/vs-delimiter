import * as vscode from 'vscode';

const LINE_BREAK_REGEX = '/\r?\n/';

export function activate(context: vscode.ExtensionContext) {
	let delimiter: string = vscode.workspace.getConfiguration().get('vs-delimiter.delimiter') || ',';
	let wrapper: string = vscode.workspace.getConfiguration().get('vs-delimiter.wrapper') || '\'';

	registerCommand(context, 'vs-delimiter.delimit', (highlighted: string) => getDelimitedText(highlighted, delimiter));
	registerCommand(context, 'vs-delimiter.wrap', (highlighted: string) => getWrappedText(highlighted, wrapper));
	registerCommand(context, 'vs-delimiter.wrapanddelimit', (highlighted: string) => wrapAndDelimitText(highlighted, delimiter, wrapper));
}

function registerCommand(context: vscode.ExtensionContext, commandId: string, processFunction: (highlighted: string) => string[]) {
	let command = vscode.commands.registerCommand(commandId, () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const selectionRange = getEditorSelection(editor);

			if (selectionRange) {
				const highlighted = editor.document.getText(selectionRange);
				let processedText = processFunction(highlighted);
				replaceSelectionWithEditedText(editor, selectionRange, processedText);
			}
		}
	});

	context.subscriptions.push(command);
}

function getEditorSelection(editor: vscode.TextEditor): vscode.Range | undefined {
	return editor.selection;
}

function getDelimitedText(text: string, delimiter: string): string[] {
	let textToDelimit = text.split(LINE_BREAK_REGEX);
	return delimitString(textToDelimit, delimiter);
}

function getWrappedText(text: string, wrapper: string): string[] {
	let textToWrap = text.split(LINE_BREAK_REGEX);
	return wrapString(textToWrap, wrapper);
}

function wrapAndDelimitText(text: string, delimiter: string, wrapper: string): string[] {
	let textToWrap = text.split(LINE_BREAK_REGEX);
	let wrappedText = wrapString(textToWrap, wrapper);
	let delimitedText = delimitString(wrappedText, delimiter);
	return delimitedText;
}

function replaceSelectionWithEditedText(editor: vscode.TextEditor, selectionRange: vscode.Range, editedText: string[]): void {
	const newText = editedText.join('\n');
	editor.edit(editBuilder => {
		editBuilder.replace(selectionRange, newText);
	});
}

function delimitString(text: string[], delimiter: string): string[] {
	let delimitedText: string[] = [];
	text.forEach(e => {
		let words = e.split(' ');
		let delimitedWords = words.map(word => word + delimiter);
		delimitedText.push(delimitedWords.join(' '));
	});
	return delimitedText;
}

function wrapString(text: string[], wrapper: string): string[] {
	let wrappedText: string[] = [];
	text.forEach(e => {
		let words = e.split(' ');
		let wrappedWords = words.map(word => wrapper + word + wrapper);
		wrappedText.push(wrappedWords.join(' '));
	});
	return wrappedText;
}