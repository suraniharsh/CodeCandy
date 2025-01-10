# CodeCandy 🍬

A modern web application for managing and sharing code snippets with syntax highlighting and organization features.

## 🌟 Features

- Create and manage code snippets with syntax highlighting
- Organize snippets into collections
- Share snippets with others
- Modern and responsive UI
- Dark mode support
- SEO optimized
- Firebase integration for data storage

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router v7
- **State Management**: React Context
- **Backend/Database**: Firebase
- **Build Tool**: Vite
- **Code Highlighting**: React Syntax Highlighter & Prism.js
- **UI Components**: Custom components with Framer Motion animations
- **Fonts**: Inter & JetBrains Mono
- **Icons**: React Icons
- **Toast Notifications**: React Hot Toast
- **SEO**: React Helmet Async
- **Type Checking**: TypeScript

## 📁 Project Structure

```
src/
├── assets/         # Static assets and images
├── components/     # Reusable UI components
├── config/         # Configuration files
├── contexts/       # React context providers
├── data/          # Static data and constants
├── hooks/         # Custom React hooks
├── lib/           # Third-party library configurations
├── pages/         # Page components
├── services/      # API and service integrations
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/codecandy.git
cd codecandy
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
yarn dev
# or
npm run dev
```

## 📝 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint
- `yarn preview` - Preview production build locally

## 📚 Key Components

- `CodeBlock`: Handles code syntax highlighting
- `CreateSnippetForm`: Form for creating new code snippets
- `Sidebar`: Navigation and collection management
- `SEO`: Handles meta tags and SEO optimization
- `SnippetView`: Displays individual snippets

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - TailwindCSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `postcss.config.js` - PostCSS configuration
- `firestore.rules` - Firebase security rules

## 🔐 Security

- Firebase Authentication for user management
- Secure Firestore rules
- Environment variables for sensitive data

## 🌐 Deployment

The project is configured for deployment on Vercel with the following configuration:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We love contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Development setup
- Code style guidelines
- Pull request process
- Bug reporting
- Code of conduct

## 📧 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

