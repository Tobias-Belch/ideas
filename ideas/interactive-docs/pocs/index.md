# Interactive Documentation POCs

This directory contains proof-of-concept implementations for different interactive documentation solutions. Each POC demonstrates how to create interactive documents that are:

- Text-based and git-versionable
- Human-readable in simple text editors
- Enhanced with styling and media in specialized environments
- Capable of executing TypeScript code snippets within the document

## Source Document

All POCs use the same source document: `/Users/tobiasbelch/fea/ideas/ideas/games/amelcraft/index.md`

This document contains:
- Markdown content with headers, lists, and text
- Code snippets in JavaScript that should be made executable
- A mix of documentation and technical examples perfect for demonstrating interactive features

## POC Implementation Instructions

### 1. Docusaurus POC

**Directory**: `./docusaurus/`

**Steps**:
1. Initialize a new Docusaurus project
2. Install Sandpack for interactive code execution
3. Convert the source document to MDX format
4. Make the JavaScript code snippets executable using Sandpack
5. Ensure the document renders with proper styling and navigation

**Key requirements**:
- Use `@codesandbox/sandpack-react` for live code execution
- Convert code blocks to Sandpack components
- Maintain all original content and structure
- Add interactive features where appropriate

**Expected outcome**: A fully functional Docusaurus site with the Amelcraft document as an interactive page with executable code snippets.

### 2. Vite POC

**Directory**: `./vite/`

**Steps**:
1. Create a new Vite project with React
2. Install and configure MDX support
3. Install Sandpack for interactive code execution
4. Convert the source document to MDX format
5. Create a simple routing system or single-page layout
6. Make JavaScript code snippets executable

**Key requirements**:
- Use `@mdx-js/react` for MDX support
- Use `@codesandbox/sandpack-react` for live code execution
- Implement a minimal but functional UI
- Ensure fast development and build times

**Expected outcome**: A lightweight Vite-based application serving the interactive document with live code execution.

### 3. Astro POC

**Directory**: `./astro/`

**Steps**:
1. Initialize a new Astro project
2. Configure MDX support
3. Install and configure Sandpack as a React component
4. Convert the source document to MDX format
5. Create appropriate layouts and styling
6. Make JavaScript code snippets executable

**Key requirements**:
- Use Astro's built-in MDX support
- Integrate React components (Sandpack) within Astro
- Leverage Astro's static site generation capabilities
- Maintain performance and SEO benefits

**Expected outcome**: An Astro-based site with the interactive document, combining static generation with interactive code execution.

### 4. Starlight POC

**Directory**: `./starlight/`

**Steps**:
1. Initialize a new Starlight project (Astro-based documentation theme)
2. Configure MDX and React component support
3. Install Sandpack for interactive code execution
4. Convert the source document to MDX format
5. Utilize Starlight's documentation features (sidebar, search, etc.)
6. Make JavaScript code snippets executable

**Key requirements**:
- Use Starlight's documentation-focused features
- Integrate Sandpack components within the Starlight framework
- Leverage built-in navigation, search, and theming
- Maintain documentation site best practices

**Expected outcome**: A professional documentation site using Starlight with the interactive Amelcraft document featuring live code execution.

## Implementation Notes

### Code Conversion Requirements

The source document contains several code snippets that should be made interactive:

1. **Drag-to-Move Example** (lines 71-83)
2. **Block Placement Example** (lines 85-93)
3. **Responsive Camera Zoom** (lines 95-99)

Each of these should be converted to Sandpack components with:
- Proper Phaser.js environment setup
- Executable code that demonstrates the concepts
- Ability to edit and run the code inline

### Common Setup for All POCs

All POCs should:
- Include a README.md with setup and run instructions
- Use TypeScript where possible
- Include proper error handling and loading states
- Be responsive and mobile-friendly
- Include basic styling that makes the content readable and professional

### Testing Criteria

Each POC should be tested for:
- Document readability and navigation
- Code execution functionality
- Mobile responsiveness
- Performance (load times, interaction responsiveness)
- Developer experience (setup, build, development workflow)

## Comparison Goals

After implementing all POCs, we should be able to compare:
- Development complexity and setup time
- Build performance and bundle size
- Runtime performance and user experience
- Maintenance and extensibility
- Documentation and community support
- Deployment options and requirements

This comparison will help determine the best solution for interactive documentation in different contexts and requirements.
