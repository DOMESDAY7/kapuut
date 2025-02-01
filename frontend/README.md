# Kapuuut frontend

## Overview

This project is a modern React frontend built with Vite for fast development and optimized builds. It uses TypeScript for type safety, ESLint for code quality, and Bun as the package manager and runtime. All UI components are sourced from [Radix UI](https://www.radix-ui.com/) to ensure maximum accessibility, and TailwindCSS with a custom theme is used for styling.

## Tech Stack

- **React** (Preact-compatible)
- **Vite** (for fast development and optimized builds)
- **TypeScript** (strict type checking and improved developer experience)
- **ESLint** (code linting and formatting)
- **Bun** (package manager and runtime)
- **Radix UI** (accessible UI components)
- **TailwindCSS** (custom theme for styling)

## Project Structure

```
/project-root
├── src/
│   ├── components/   # All Radix UI-based components
│   ├── pages/        # Page-level components
│   ├── styles/       # Global styles (Tailwind)
│   ├── hooks/        # Custom hooks
│   ├── utils/        # Utility functions
│   ├── App.tsx       # Main App component
│   ├── main.tsx      # Entry point
│
├── public/           # Static assets
├── bun.lockb         # Bun package lock file
├── vite.config.ts    # Vite configuration
├── tailwind.config.ts # Tailwind custom theme config
├── tsconfig.json     # TypeScript configuration
├── .eslintrc.js      # ESLint configuration
├── package.json      # Dependencies and scripts
└── README.md         # Project documentation
```

## Installation

Ensure you have [Bun](https://bun.sh/) installed.

```sh
bun install
```

## Development

Start the development server:

```sh
bun run dev
```

## Build

To build the production-ready version:

```sh
bun run build
```

## Linting & Formatting

Run ESLint to check for linting issues:

```sh
bun run lint
```

## Custom Tailwind Theme

The project uses a customized TailwindCSS theme defined in `tailwind.config.ts`. Update this file to adjust theme settings, colors, typography, and other styles.

## Accessibility with Radix UI

All components in `/src/components/` are based on Radix UI primitives, ensuring high accessibility standards by default.

## Contribution

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

## License

This project is licensed under [MIT License](LICENSE).

---

Happy coding! 🚀

