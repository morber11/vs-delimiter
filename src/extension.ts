import * as vscode from 'vscode';

const LINE_BREAK_REGEX = /\r?\n/;

export function activate(context: vscode.ExtensionContext) {
	let delimiter = vscode.workspace.getConfiguration().get('vs-delimiter.delimiter') || ',';
	let wrapper = vscode.workspace.getConfiguration().get('vs-delimiter.wrapper') || '\'';
	let delimEscapeChar = vscode.workspace.getConfiguration().get('vs-delimiter.delimiter_escape_char') || '\\';
	let wrapEscapeChar = vscode.workspace.getConfiguration().get('vs-delimiter.wrapper_escape_char') || '\'';

	registerCommand(context, 'vs-delimiter.delimit', text => getDelimitedText(text, delimiter));
	registerCommand(context, 'vs-delimiter.wrap', text => getWrappedText(text, wrapper));
	registerCommand(context, 'vs-delimiter.wrapanddelimit', text => wrapAndDelimitText(text, delimiter, wrapper));
}

function registerCommand(context: vscode.ExtensionContext, commandId: string, processFunction: (text: string) => string) {
	let command = vscode.commands.registerCommand(commandId, () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const highlighted = editor.document.getText(selection);
			const processedText = processFunction(highlighted);
			replaceSelectionWithEditedText(editor, selection, processedText);
		}
	});

	context.subscriptions.push(command);
}

function getDelimitedText(text: string, delimiter: string): string {
	return text
	.split(LINE_BREAK_REGEX)
	.map(line => line
		.split(' ')
		.map(word => word + delimiter)
		.join(' ')
	)
	.join('\n')
	.slice(0, -delimiter.length);
}

function getWrappedText(text: string, wrapper: string): string {
	return text
		.split(LINE_BREAK_REGEX)
		.map(line => line
			.split(' ')
			.map(word => `${wrapper}${word}${wrapper}`)
			.join(' ')
		)
		.join('\n');
}

function wrapAndDelimitText(text: string, delimiter: string, wrapper: string): string {
	return getDelimitedText(getWrappedText(text, wrapper), delimiter);
}

function replaceSelectionWithEditedText(editor: vscode.TextEditor, selectionRange: vscode.Range, editedText: string): void {
	editor.edit(editBuilder => {
		editBuilder.replace(selectionRange, editedText);
	});
}
