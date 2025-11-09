---
created: 2025-09-17T19:44:33+02:00
modified: 2025-09-17T19:47:38+02:00
---

# AI Markdown Note Taking App

## Core Idea and Motivation
The goal is to create an Android app that combines the simplicity of Markdown note-taking with the power of AI-based chat. The app would store notes in a Git repository, ensuring universality and version control.

## Core Goals and Features
- **Markdown Storage**: All notes are stored in a Git repository, ensuring easy access and integration with other tools.
- **AI Chat Integration**: An AI assistant can interact with the user to generate or modify notes, and directly update the Markdown files.
- **Voice Input**: Users can use voice-to-text to dictate notes, which are then converted to Markdown.
- **Git Operations**: Integrate Git functionality to pull, commit, and push changes directly from the app.

## Alternatives and Solutions Discussed
- **Notion**: Great for collaboration and features but limited export options and tied to its ecosystem.
- **Obsidian**: Strong Markdown support and local storage but requires extra steps for sync across devices.

## Feasibility and Cost
- **Development**: Requires Android development skills, Git integration (e.g., JGit), and AI API integration (e.g., OpenAI).
- **Cost**: Mostly your time and a small server if needed. OpenAI offers a free tier for basic usage.
- **Open Source**: GitJournal is open-source, allowing for easy customization.
