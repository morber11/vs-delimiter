# Change Log

All notable changes to the ``vs-delimiter`` extension will be documented in this file.

## [1.3.0]

* Refresh config on each command invocation (no reload needed after changing settings)
* Extract command IDs and config keys into named constants
* Remove explicit `activationEvents` (auto-detected from `contributes.commands`)
* Remove redundant `@types/glob` dependency
* Migrate from legacy `.eslintrc.json` to flat config (`eslint.config.js`)
* Stricter linting rules (`prefer-const`, `no-trailing-spaces`, `eol-last`)
* Add tests for single-word, whitespace-only, empty delimiter/wrapper, and multiline composition

## [1.2.3]

* Refactor, split logic instead of having it all in extension.ts
* Update packages
* Add tests
* Add marketplace icon

## [1.1.1]

* Improved multiline support for wrapping and delimiting
* Preserved whitespace while wrapping and delimiting
* Removed unused escape character settings
* Added unit and integration tests

## [1.1.0]

* Added multiline support

## [1.0.1]

* Added an escape character for both wrapping and delimiting
* Removed trailing delimiter at the end of strings

## [1.0.0]

* Initial release
