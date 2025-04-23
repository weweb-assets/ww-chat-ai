# WW-CHAT-AI

A customizable chat interface component designed as a [WeWeb](https://www.weweb.io/) element.

## Features

* Real-time like message display
* Customizable styling for all elements
* User presence indicators (avatar, status, name, location)
* Automatic header updates based on chat partners
* Group chat support
* Message grouping by sender
* Date separators ("Today", "Yesterday", or specific dates)
* File attachment support (optional)
* Configurable localization for date/time formatting
* Events for user interactions (message sent, received, clicked, etc.)
* Actions for programmatic control (add message, clear history, scroll)
* Flexible data mapping using WeWeb formulas

*(For detailed configuration options, events, actions, and examples, please refer to the `AI.md` file.)*

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd ww-chat-ai
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Local Development & Usage in WeWeb

1. **Start the local development server:**
    Choose an available port (e.g., 9000) and run:

    ```bash
    # Ensure you are using zsh profile if needed
    npm run serve --port=9000
    ```

2. **Add to WeWeb Editor:**
    * Open your WeWeb project editor.
    * Click on your profile picture/icon and select "Developer mode".
    * In the "Custom Elements" section, add the local server address (e.g., `http://localhost:9000`).
3. **Use the Element:**
    * The `ww-chat-ai` element should now appear in the "Add" panel under "Custom Elements".
    * Drag it onto your page and configure its properties in the WeWeb editor.

## Build

To check for build errors before deployment, run:

```bash
# Ensure you are using zsh profile if needed
npm run build --name="ww-chat-ai" --type="element"
```

## Deploy

To deploy the element for use in production WeWeb projects, run:

```bash
# Ensure you are using zsh profile if needed
npm run deploy --name="ww-chat-ai" --type="element"
```

## Contributing

Contributions are welcome! When modifying the codebase, please:

1. Maintain compatibility with WeWeb
2. Follow the existing code style (ESLint, Prettier)
3. Test changes thoroughly in the WeWeb editor
4. Document any new features or changes

## License

MIT
