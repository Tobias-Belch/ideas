# Docusaurus Interactive Documentation POC

This is a proof-of-concept implementation of interactive documentation using Docusaurus with Sandpack for live code execution.

## Features

- **Docusaurus Framework**: Full-featured documentation site with navigation, search, and theming
- **Interactive Code Execution**: Live JavaScript/TypeScript code execution using Sandpack
- **Phaser.js Support**: Pre-configured environment for game development examples
- **TypeScript Support**: Full TypeScript support throughout the project
- **Responsive Design**: Mobile-friendly interface with adaptive layouts

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd docusaurus
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To build the site for production:

```bash
npm run build
```

To serve the built site locally:

```bash
npm run serve
```

## Project Structure

```
docusaurus/
├── docs/
│   ├── amelcraft.mdx          # Main interactive documentation
│   └── intro.md               # Default intro page
├── src/
│   ├── components/
│   │   └── SandpackDemo.tsx   # Custom Sandpack component
│   └── pages/
│       └── index.tsx          # Homepage
├── docusaurus.config.ts       # Docusaurus configuration
└── package.json
```

## Key Components

### SandpackDemo Component

The `SandpackDemo` component (`src/components/SandpackDemo.tsx`) provides:

- Pre-configured Phaser.js environment
- Live code editing and execution
- Error handling and console output
- Responsive layout

Usage in MDX files:
```mdx
<SandpackDemo
  title="Example Title"
  code={`// Your JavaScript code here`}
/>
```

### Interactive Documentation

The main documentation is in `docs/amelcraft.mdx`. This file contains:

- Interactive code examples using the SandpackDemo component
- Proper MDX syntax for combining Markdown with React components
- Pre-configured examples for drag-and-drop, block placement, and camera controls

## Completing the POC

To complete this POC:

1. **Replace the content**: Replace `docs/amelcraft.mdx` with the actual content from the source document
2. **Convert code blocks**: Transform JavaScript code blocks to `<SandpackDemo>` components
3. **Test functionality**: Ensure all interactive examples work properly
4. **Customize styling**: Adjust themes and styling as needed

## Development Workflow

1. **Hot reload**: The development server supports hot reloading for both content and components
2. **Error handling**: Build-time errors are displayed in the browser during development
3. **Component testing**: Test the SandpackDemo component with different code examples
4. **MDX validation**: Ensure proper MDX syntax for component integration

## Performance Considerations

- **Code splitting**: Docusaurus automatically splits code for optimal loading
- **Sandpack optimization**: Interactive examples are loaded on-demand
- **Static generation**: Site is pre-built for optimal performance
- **SEO friendly**: Built-in SEO optimization and meta tag support

## Customization Options

- **Theming**: Modify `docusaurus.config.ts` and CSS files for custom styling
- **Component enhancement**: Extend the SandpackDemo component with additional features
- **Plugin integration**: Add Docusaurus plugins for enhanced functionality
- **Configuration**: Adjust build settings and deployment options

## Deployment

The site can be deployed to various platforms:

- **GitHub Pages**: Built-in GitHub Pages deployment support
- **Netlify**: Direct deployment from repository
- **Vercel**: Automatic deployment with git integration
- **Traditional hosting**: Build and deploy static files

## Testing

Run the site locally to test:

1. All interactive code examples execute properly
2. Navigation and search functionality work
3. Mobile responsiveness is maintained
4. Performance is acceptable for the target audience

## Next Steps

1. Add the actual Amelcraft documentation content
2. Implement additional interactive examples
3. Add search functionality configuration
4. Set up automated deployment
5. Add analytics and monitoring

## Troubleshooting

- **Build errors**: Check the console for MDX syntax errors
- **Component issues**: Verify SandpackDemo component props
- **Performance**: Monitor bundle size and loading times
- **Browser compatibility**: Test across different browsers and devices
