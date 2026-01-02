# JSON Translator for Raycast

A [Raycast](https://raycast.com) extension that helps developers quickly translate a selected JSON key-value pair in their code editor to multiple other locale files.

It automatically finds other language files in your configured `locales` folder (e.g., `es.json`, `fr.json`) and appends the translated key-value pair to them.

## Features

- ⚡ **Instant Translation:** Select a line like `"hello": "Hello World"` and run the command.
- 🌍 **Multi-file Support:** Automatically updates all sibling JSON files in your locales directory.
- 🛠 **Configurable:** Set your specific locales path and source language.
- 🤖 **Google Translate:** Uses Google Translate for automatic translations.
- 🧹 **Auto-formatting:** Keeps your JSON files neat with standard indentation.

## Installation

### From Source (Local Install)

1.  Clone this repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/raycast-json-translator.git
    cd raycast-json-translator
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Add to Raycast:
    -   Open Raycast.
    -   Type **"Import Extension"**.
    -   Select the `raycast-json-translator` folder.

## Configuration

Before using, you need to configure the extension in Raycast Preferences:

1.  **Locales Directory:** The absolute path to your project's translation folder (e.g., `/Users/anh/Projects/my-app/src/locales`).
2.  **Source Language:** The filename of your main language without extension (default: `en`). This file will be *skipped* during translation to prevent overwriting your manual work.

## Usage

1.  Open your code editor (VS Code, Cursor, etc.).
2.  Select a JSON line you just added:
    ```json
    "welcome_message": "Welcome to our application"
    ```
3.  Open Raycast and run **Translate JSON Selection**.
4.  The extension will:
    -   Read the `key` and `value`.
    -   Translate "Welcome to our application" into Spanish, French, Chinese, etc. (depending on files in your locales folder).
    -   Write the new keys to `es.json`, `fr.json`, `cn.json`, etc.

## Troubleshooting

-   **"Locales path does not exist":** Double-check the path in Raycast Extension Settings. It must be an absolute path.
-   **"Invalid selection":** Ensure you have selected the full key-value pair including quotes.
-   **"Translation failed":** Check your internet connection.

## License

MIT
# raycast-json-translator
