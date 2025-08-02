# The-Design-Archive-From-AI
A Node.js-based website creator that lets users assemble and customize sites from modular blocks, focusing on SEO.

## Overview

The Design Archive is a Node.js‑based website creator that lets you assemble and customise websites from modular design blocks. Its primary goal is to help you build beautiful, SEO‑optimised sites quickly without needing to start from scratch.

## Features

- **Modular blocks** – Upload HTML, CSS or SCSS snippets as "blocks" and reuse them across pages.
- **Built‑in SCSS compiler** – Drop SCSS files and the server will compile them to CSS automatically.
- **Context‑aware SEO** – Define a site title and description once; the app uses this metadata to optimise your generated pages.
- **Browser‑based interface** – No coding necessary: fill out forms to set context and upload blocks through a simple web UI.
- **Extensible** – Blocks are stored as plain HTML files inside `public/blocks/`, making it easy to add, remove or modify them manually.
- **Express backend** – Powered by Express with endpoints to save context and upload blocks, ready to deploy to any Node‑compatible server.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) version 14 or higher.
- npm (included with Node.js).

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/masteryourcreativemind/The-Design-Archive-From-AI.git
cd The-Design-Archive-From-AI
npm install
```

### Running the app

Start the server in development mode (auto‑reloads on file changes):

```bash
npm run dev
```

Or run in production mode:

```bash
npm start
```

The app will start on port `3000` by default. Open your browser at [http://localhost:3000](http://localhost:3000) to use the builder.

## Usage

1. **Set site context:** On the homepage, provide a site title and description. This information is saved and will be used to generate SEO‑friendly metadata for your pages.
2. **Upload design blocks:** Upload your HTML, CSS or SCSS blocks using the “Upload Block” form. SCSS files will be compiled automatically.
3. **Assemble pages:** Uploaded blocks appear in the “Available Blocks” list. Copy the markup from any block into your own pages or extend the system to assemble pages automatically.
4. **Develop your design:** Edit the blocks in `public/blocks/` directly to refine your designs. Add new static assets (images, fonts, etc.) to the `public/` folder.

## Project structure

```
├── index.js            # Express server with API routes
├── package.json        # Project metadata and dependencies
├── .gitignore          # Ignored files/directories
├── public/
│   ├── index.html      # Front‑end user interface
│   ├── css/
│   │   └── style.css   # Styles for the UI
│   ├── js/
│   │   └── app.js      # Client‑side script for forms & block list
│   └── blocks/
│       └── hero.html   # Sample block (add your own here)
└── uploads/            # Temporary storage for uploaded files (auto‑created)
```

Feel free to fork the project and enhance it with new features such as drag‑and‑drop block editing, page templating, or automatic metadata generation. Pull requests are welcome!

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
