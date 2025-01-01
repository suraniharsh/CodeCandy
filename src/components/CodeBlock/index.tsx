import { useEffect, useRef } from 'react';
import { Prism } from '../../lib/prism';

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, showLineNumbers = true }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const highlight = () => {
      if (codeRef.current) {
        try {
          Prism.highlightElement(codeRef.current);
        } catch (error) {
          console.error('Prism highlight error:', error);
        }
      }
    };

    // Small delay to ensure Prism is ready
    setTimeout(highlight, 0);
  }, [code, language]);

  // Default to plaintext if language isn't supported
  const normalizedLanguage = Prism.languages[language.toLowerCase()] ? language.toLowerCase() : 'plaintext';
  const className = `language-${normalizedLanguage} ${showLineNumbers ? 'line-numbers' : ''}`;

  return (
    <div className="rounded-lg overflow-hidden bg-[#1E1E1E] border border-[#333333]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333333]">
        <span className="text-xs text-gray-400 uppercase">{normalizedLanguage}</span>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className={className} style={{ margin: 0, background: 'transparent', fontSize: '14px' }}>
          <code ref={codeRef} className={className}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
} 