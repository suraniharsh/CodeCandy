import { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import html2canvas from 'html2canvas';
import { FiDownload, FiCopy, FiTwitter, FiShare2, FiSettings } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface CodePreviewProps {
  initialCode?: string;
  language?: string;
  onSave?: (newCode: string) => void;
  onChange?: (newCode: string) => void;
  readOnly?: boolean;
  showSaveButton?: boolean;
}

interface ExportSettings {
  format: 'png' | 'svg' | 'copy';
  scale: number;
  showBackground: boolean;
}

export function CodePreview({ 
  initialCode = '', 
  language = 'typescript', 
  onSave,
  onChange,
  readOnly = false,
  showSaveButton = true
}: CodePreviewProps) {
  const [code, setCode] = useState(initialCode);
  const [theme, setTheme] = useState('vs-dark');
  const [editorHeight, setEditorHeight] = useState('auto');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'png',
    scale: 2,
    showBackground: true
  });
  const exportRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  // Reset hasChanges when initialCode changes
  useEffect(() => {
    setCode(initialCode);
    setHasChanges(false);
  }, [initialCode]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    updateEditorHeight();
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    setHasChanges(newCode !== initialCode);
    if (onChange) {
      onChange(newCode);
    }
  };

  const handleSave = () => {
    if (onSave && hasChanges) {
      onSave(code);
      setHasChanges(false);
    }
  };

  const updateEditorHeight = () => {
    if (!editorRef.current) return;
    
    const lineCount = editorRef.current.getModel().getLineCount();
    const lineHeight = 21;
    const padding = 44;
    const newHeight = lineHeight * lineCount + padding;
    setEditorHeight(`${newHeight}px`);
  };

  useEffect(() => {
    updateEditorHeight();
  }, [code]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You can add a toast notification here
      console.log('Code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleExport = async () => {
    if (!exportRef.current || !editorRef.current) return;
    
    try {
      if (exportSettings.format === 'copy') {
        await handleCopyCode();
        return;
      }

      const canvas = await html2canvas(exportRef.current, {
        scale: exportSettings.scale,
        backgroundColor: exportSettings.showBackground ? '#1E1E1E' : 'transparent',
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `code-snippet.${exportSettings.format}`;
      link.href = canvas.toDataURL(`image/${exportSettings.format}`);
      link.click();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleTweet = () => {
    const tweetText = encodeURIComponent('Check out this code snippet from CodeCandy! 🍬\n');
    const url = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-dark-800 rounded-lg border border-dark-700 shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <div className="flex items-center space-x-4">
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-dark-700 border border-dark-600 rounded-md px-3 py-1.5 text-sm text-dark-100"
            >
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-3">
            {showSaveButton && onSave && hasChanges && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm flex items-center"
              >
                Save Changes
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyCode}
              className="p-2 text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 rounded-md transition-colors"
              title="Copy code"
            >
              <FiCopy className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTweet}
              className="p-2 text-[#1DA1F2] hover:bg-[#1DA1F2]/10 rounded-md transition-colors"
              title="Share on Twitter"
            >
              <FiTwitter className="w-5 h-5" />
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="p-2 text-primary-400 hover:text-primary-300 hover:bg-primary-400/10 rounded-md transition-colors"
                title="Export options"
              >
                <FiSettings className="w-5 h-5" />
              </motion.button>

              {showExportOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50"
                >
                  <div className="p-3 space-y-3">
                    <div>
                      <label className="text-sm text-dark-300 block mb-1">Format</label>
                      <select
                        value={exportSettings.format}
                        onChange={(e) => setExportSettings(prev => ({ ...prev, format: e.target.value as 'png' | 'svg' | 'copy' }))}
                        className="w-full bg-dark-700 border border-dark-600 rounded-md px-2 py-1.5 text-sm text-dark-100"
                      >
                        <option value="png">PNG Image</option>
                        <option value="copy">Copy to Clipboard</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-dark-300 block mb-1">Scale</label>
                      <select
                        value={exportSettings.scale}
                        onChange={(e) => setExportSettings(prev => ({ ...prev, scale: Number(e.target.value) }))}
                        className="w-full bg-dark-700 border border-dark-600 rounded-md px-2 py-1.5 text-sm text-dark-100"
                      >
                        <option value="1">1x</option>
                        <option value="2">2x</option>
                        <option value="3">3x</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm text-dark-300">Show Background</label>
                      <input
                        type="checkbox"
                        checked={exportSettings.showBackground}
                        onChange={(e) => setExportSettings(prev => ({ ...prev, showBackground: e.target.checked }))}
                        className="rounded border-dark-600 text-primary-500 focus:ring-primary-500"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleExport}
                      className="w-full flex items-center justify-center px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm"
                    >
                      <FiDownload className="mr-2" />
                      Export {exportSettings.format.toUpperCase()}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="relative" ref={exportRef}>
          <div className="absolute top-3 left-3 flex space-x-2 z-10">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>

          <Editor
            height={editorHeight}
            defaultLanguage={language}
            value={code}
            theme={theme}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', Menlo, Monaco, 'Courier New', monospace",
              lineHeight: 1.5,
              padding: { top: 32, bottom: 12 },
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              renderLineHighlight: 'none',
              hideCursorInOverviewRuler: true,
              overviewRulerBorder: false,
              overviewRulerLanes: 0,
              contextmenu: false,
              scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden'
              },
              lineNumbers: 'on',
              glyphMargin: false,
              folding: false,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 4,
              renderWhitespace: 'none',
              cursorStyle: 'line',
              cursorWidth: 2,
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              wordWrap: 'on',
              wordWrapColumn: 80,
              wrappingIndent: 'same',
              tabSize: 2,
              renderIndentGuides: false,
              fixedOverflowWidgets: true,
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
              readOnly: readOnly
            }}
          />
        </div>
      </div>
    </div>
  );
} 