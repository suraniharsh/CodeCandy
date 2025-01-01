// Core
import Prism from 'prismjs';
// CSS
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

// Basic languages only
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';

// Line numbers plugin
import 'prismjs/plugins/line-numbers/prism-line-numbers';

// Ensure languages object exists
if (typeof window !== 'undefined') {
  window.Prism = Prism;
}

// Basic plaintext support
Prism.languages.plaintext = Prism.languages.plaintext || {
  'text': /[\s\S]+/
};

export { Prism }; 