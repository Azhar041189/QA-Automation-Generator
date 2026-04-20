# 🧠 Ollama Setup Guide for QA Forge

To enable local AI-powered test generation, you need to have **Ollama** running on your machine. This guide will help you get set up in minutes.

## 1. Installation

1.  **Download Ollama**: Visit [ollama.com](https://ollama.com/download) and download the version for **Windows**.
2.  **Install**: Run the installer and follow the prompts.
3.  **Run**: Once installed, you should see the Ollama icon in your system tray.

## 2. Pulling Models

You need to download the AI models you want to use. Open your terminal (PowerShell or Command Prompt) and run:

```powershell
# Recommended for best accuracy (Requires ~5GB RAM)
ollama pull qwen2.5-coder:7b

# Recommended for speed/low-memory (Requires ~1.5GB RAM)
ollama pull gemma3:1b

# General purpose model
ollama pull llama3
```

## 3. Configuring the Application

1.  **Open Dashboard**: Start the dashboard by running `npm run dashboard`.
2.  **Go to Settings**: Click on the **Settings** tab in the sidebar.
3.  **AI Engine Configuration**: Select your pulled model from the dropdown.
4.  **Save**: Click **Save Preferences**.

## 4. Verification

To verify that Ollama is reachable, you can run this command in your terminal:

```powershell
curl http://localhost:11434/api/tags
```
If you see a list of your pulled models, the application will be able to connect correctly.

---

> [!TIP]
> **Performance Tip**: If the generation feels slow, try using `gemma3:1b`. It is highly optimized for speed while still being capable of generating valid automation scripts.

> [!IMPORTANT]
> **Keep Ollama Running**: The application communicates with Ollama locally. Ensure the Ollama processes are running in the background before clicking "Generate".
