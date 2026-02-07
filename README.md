# FusionX AI

**FusionX** is a limitless, multi-model AI assistant built with **Next.js**. It serves as a unified interface for instantly switching between powerful LLMs and Image Generation models, providing completely free, unlimited access without logins or usage caps.

> **Powered by [OpenRouter.ai](https://openrouter.ai/)**

## 🚀 Features

- **Multi-Model Intelligence:** Switch instantly between top-tier models:
 - **Multi-Model Intelligence:** Switch instantly between a curated set of powerful models:
    - 🧠 OpenAI
    - 👁️ DeepSeek
    - ⚡ Mistral
    - 🐑 Llama
    - 🤖 Arcee, Z.AI, Nemotron, Dolphin
- **Image Generation:** Create high-quality AI art using **flux**, **turbo** & **gptimage**.
- **Privacy First & Sync:** By default guest chats live in your browser's local storage. If you sign in, chats can be securely synced to your account so you can access conversations across devices.
- **Developer Friendly:**
  - Syntax highlighting for code blocks.
  - One-click code copying.
  - Markdown support (Tables, Lists, Math).
- **Real-Time Streaming:** Experience typewriter-style responses with low latency.
- **Responsive Design:** Fully responsive dark-mode UI built with Tailwind CSS.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **UI Library:** [React.js](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/) 
- **Markdown Rendering:** `react-markdown`
- **API:** [OpenRouter.ai](https://openrouter.ai/)

## 📦 Installation

Follow these steps to run FusionX locally on your machine.

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Steps

1.  **Clone the repository**

    ```bash
    git clone https://github.com/arifbasha559/FusionX.git
    cd fusionx
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**

    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:3000` to see the app running.

## 📂 Project Structure

```bash
app/
├── about/              # About page
├── chat/               # Main chat interface
├── globals.css         # Global styles & Tailwind
├── layout.js           # Global layout (includes Navbar)
├── page.js             # Landing page
Components/
├── Navbar.jsx          # Sticky navigation used across app
├── Chat/
│   ├── Navbar.jsx      # Chat sidebar / history
│   ├── Chat.jsx        # Core chat logic & UI
│   ├── Input.jsx       # Message input & model selector
api/
├── fetchapi.js         # API wrapper for OpenRouter (server routes)
assets/
├── brain-circuit.png
├── brain-circuit.svg
public/
└── ...
```

---

## 🎨 Customization

### Changing Models

You can add or remove models in `Components/Chat/Chat.jsx` (or the `models` array used by the chat component):

```javascript
const models = ["openai", "mistral", "deepseek", "google", "llama", "Arcee", "Z.AI", "Nemotron", "dolphin"];
```

### Theming

Tailwind colors are customized in `globals.css` or directly in the classes using standard utility classes like `bg-violet-600` or `text-gray-400`.

## 🤝 Contributing

Contributions are welcome\! Please follow these steps:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

## 🙏 Acknowledgements

- Big thanks to the team at **OpenRouter.ai** for providing the free API that powers this project.
- Built with ❤️ by Arif's Team.

---

_Star this repo if you find it useful\! ⭐_

