# FusionX AI

**FusionX** is a limitless, multi-model AI assistant built with **Next.js**. It serves as a unified interface for instantly switching between powerful LLMs and Image Generation models, providing completely free, unlimited access without logins or usage caps.

> **Powered by [Pollinations.ai](https://pollinations.ai)**

## 🚀 Features

- **Multi-Model Intelligence:** Switch instantly between top-tier models:
  - 🧠 **OpenAI** & **Gemini**
  - ⚡ **Mistral** & **Bidara**
  - 👁️ **DeepSeek** & **Qwen Coder**
  - 🔓 **Uncensored/Raw Models** (Evil, Unity)
- **Image Generation:** Create high-quality AI art using **flux**,**turbo** & **gptimage**.
- **Privacy First:** Your chat history lives in your browser's local state. We do not store your messages on any server.
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
- **API:** [Pollinations.ai](https://github.com/pollinations/pollinations)

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
    src/
    ├── app/
    │   ├── layout.js      # Global layout (includes Navbar)
    │   ├── page.js        # Landing Page
    │   ├── chat/          # Main Chat Interface
    │   ├── about/         # About Page
    │   ├── contact/       # Contact Page
    │   └── globals.css    # Global styles & Tailwind
    ├── components/
    │   ├── Navbar.jsx     # Sticky navigation
    │   ├── Chat/
    │       ├── Navbar.jsx    # Chat history sidebar
    │       ├── Chat.jsx       # Core chat logic & UI
    │       ├── Input.jsx      # Message input & model selector
    │       └── ...
    ├── api/
    │   └── fetchapi.js    # API wrapper for Pollinations
    └── assets/
        ├── brain-circuit.png  # Logo
        └── brain-circuit.svg  # Logo

```

---

## 🎨 Customization

### Changing Models

You can add or remove models in `src/components/Chat.jsx`:

```javascript
const models = ["openai", "deepseek", "gemini", "mistral", ...];
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

- Big thanks to the team at **Pollinations.ai** for providing the free API that powers this project.
- Built with ❤️ by [Your Name].

---

_Star this repo if you find it useful\! ⭐_

