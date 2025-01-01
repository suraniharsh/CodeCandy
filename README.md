# CodeCandy 🍬

&#x20;  &#x20;

## About CodeCandy

CodeCandy is a modern web application designed for developers to manage and share code snippets efficiently. With its sleek, responsive UI, dark theme support, and offline capabilities, CodeCandy provides a seamless experience for organizing your code, regardless of where you are.

### Key Features:

- **Code Management**: Create, edit, delete, and organize snippets in collections.
- **User Experience**: Dark theme, responsive design, and keyboard shortcuts.
- **Data Handling**: Online/offline support, real-time updates, and secure data access.
- **Authentication**: Google with protected routes.
- **Performance**: Optimized animations, caching, and lazy loading for blazing-fast performance.

---

## Setup Instructions ⚙️

Follow these steps to get CodeCandy running on your local machine:

### Prerequisites:

- Node.js (v18 or later)
- npm or yarn
- Firebase project configuration

### Steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/codecandy.git
   cd codecandy
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Setup Firebase Configuration:**

   - Create a `.env` file in the root directory.
   - Add your Firebase configuration:
     ```env
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     ```

4. **Start the Development Server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## Contribution Guidelines 🛠️

We welcome contributions to CodeCandy! To contribute:

1. **Fork the Repository:**
   Click the "Fork" button on the top right of this repository.

2. **Create a Branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit Your Changes:**
   Ensure your code follows the existing style and guidelines.

   ```bash
   git add .
   git commit -m "Add your commit message"
   ```

4. **Push Your Branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Submit a Pull Request:**
   Go to the repository on GitHub and open a pull request. Include a clear description of the changes made.

---

## License 🔒

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Enjoy using CodeCandy and feel free to contribute to its growth! 🌟

