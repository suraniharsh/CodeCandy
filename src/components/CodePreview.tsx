import { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import html2canvas from 'html2canvas';
import { FiDownload, FiCopy, FiShare2, FiImage, FiClipboard, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

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
  const [showShareOptions, setShowShareOptions] = useState(false);

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
    // Set minimum height for better visibility
    const minHeight = 300; // Increased from 150 to 300
    const calculatedHeight = Math.max(lineHeight * lineCount + padding, minHeight);
    setEditorHeight(`${calculatedHeight}px`);
  };

  useEffect(() => {
    updateEditorHeight();
  }, [code]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!', {
        icon: '📋',
        style: {
          background: '#1F2937',
          color: '#F3F4F6',
          border: '1px solid #374151',
        },
      });
    } catch (error) {
      console.error('Failed to copy code:', error);
      toast.error('Failed to copy code');
    }
  };

  const handleExport = async () => {
    if (!exportRef.current || !editorRef.current) return;
    
    try {
      const canvas = await html2canvas(exportRef.current, {
        scale: exportSettings.scale,
        backgroundColor: exportSettings.showBackground ? '#1E1E1E' : 'transparent',
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = 'code-snippet.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success('Code exported successfully!', {
        icon: '🖼️',
        style: {
          background: '#1F2937',
          color: '#F3F4F6',
          border: '1px solid #374151',
        },
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export code');
    }
  };

  const handleShare = async (platform: 'twitter' | 'linkedin' | 'github') => {
    if (!exportRef.current) return;

    try {
      // Show loading toast
      const loadingToast = toast.loading('Preparing to share...', {
        style: {
          background: '#1F2937',
          color: '#F3F4F6',
          border: '1px solid #374151',
        },
      });

      // Generate image for sharing
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        backgroundColor: '#1E1E1E',
        logging: false,
        allowTaint: true,
        useCORS: true,
        width: exportRef.current.offsetWidth,
        height: exportRef.current.offsetHeight
      });
      
      // Add CodeCandy watermark
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = 'bold 14px Inter';
        ctx.fillStyle = '#6D28D9';
        ctx.fillText('Made with CodeCandy 🍬', 10, canvas.height - 10);
      }

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, 'image/png', 1);
      });

      // Create file from blob
      const file = new File([blob], 'code-snippet.png', { type: 'image/png' });
      
      // Clear loading toast
      toast.dismiss(loadingToast);

      const websiteUrl = 'https://codecandy.suraniharsh.codes';
      
      // Try native share if available
      if (navigator.share) {
        try {
          const shareData: any = {
            title: '🍬 CodeCandy Snippet',
            text: `✨ Check out this awesome code snippet I created!\n\n🚀 Create your own beautiful code snippets at ${websiteUrl}\n\n#CodeCandy #coding #developer`,
            files: [file]
          };
          await navigator.share(shareData);
          return;
        } catch (error) {
          console.error('Native share failed:', error);
          // Fall back to platform-specific sharing
        }
      }

      // Platform-specific sharing as fallback
      switch (platform) {
        case 'twitter':
          const tweetText = encodeURIComponent(`✨ Check out this awesome code snippet I created with CodeCandy!\n\n🚀 Create your own beautiful code snippets at ${websiteUrl}\n\n#CodeCandy #coding #developer`);
          window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
          break;
          
        case 'linkedin':
          const linkedinText = encodeURIComponent(`✨ I just created this beautiful code snippet using CodeCandy!\n\n🎯 CodeCandy is an amazing tool for developers to create and share beautiful code snippets.\n\n🚀 Try it out at ${websiteUrl}`);
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(websiteUrl)}&title=${encodeURIComponent('Beautiful Code Snippet Created with CodeCandy')}&summary=${linkedinText}`, '_blank');
          break;
          
        case 'github':
          const gistDescription = `✨ Beautiful code snippet created with CodeCandy 🍬`;
          const gistContent = `${code}\n\n<!-- 🚀 Created with CodeCandy: ${websiteUrl} -->\n<!-- Make your code beautiful! -->`;
          const gistUrl = `https://gist.github.com/?filename=code-snippet.${language}&value=${encodeURIComponent(gistContent)}&description=${encodeURIComponent(gistDescription)}`;
          window.open(gistUrl, '_blank');
          break;
      }

      // Show success toast
      toast.success('Opening share dialog...', {
        icon: '🔗',
        style: {
          background: '#1F2937',
          color: '#F3F4F6',
          border: '1px solid #374151',
        },
        duration: 3000
      });
    } catch (error) {
      console.error('Share error:', error);
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : 'Failed to share code');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showExportOptions && !target.closest('.export-dropdown')) {
        setShowExportOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExportOptions]);

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
              className="p-2 text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 rounded-md transition-colors flex items-center gap-2"
              title="Copy code"
            >
              <FiCopy className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">Copy</span>
            </motion.button>

            {/* Direct Share Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                try {
                  if (!exportRef.current) return;

                  // Show loading toast
                  const loadingToast = toast.loading('Preparing to share...', {
                    style: {
                      background: '#1F2937',
                      color: '#F3F4F6',
                      border: '1px solid #374151',
                    },
                  });

                  // Generate image for sharing
                  const canvas = await html2canvas(exportRef.current, {
                    scale: 2,
                    backgroundColor: '#1E1E1E',
                    logging: false,
                    allowTaint: true,
                    useCORS: true,
                    width: exportRef.current.offsetWidth,
                    height: exportRef.current.offsetHeight
                  });
                  
                  // Add CodeCandy watermark
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.font = 'bold 14px Inter';
                    ctx.fillStyle = '#6D28D9';
                    ctx.fillText('Made with CodeCandy 🍬', 10, canvas.height - 10);
                  }

                  // Convert canvas to blob
                  const blob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob((blob) => {
                      resolve(blob as Blob);
                    }, 'image/png', 1);
                  });

                  // Create file from blob
                  const file = new File([blob], 'code-snippet.png', { type: 'image/png' });
                  
                  // Clear loading toast
                  toast.dismiss(loadingToast);

                  const websiteUrl = 'https://codecandy.suraniharsh.codes';
                  
                  // Try native share if available
                  if (navigator.share) {
                    const shareData: any = {
                      title: '🍬 CodeCandy Snippet',
                      text: `✨ Check out this awesome code snippet I created!\n\n🚀 Create your own beautiful code snippets at ${websiteUrl}\n\n#CodeCandy #coding #developer`,
                      files: [file]
                    };
                    await navigator.share(shareData);
                  } else {
                    // Fall back to Twitter share if native sharing is not available
                    const tweetText = encodeURIComponent(`✨ Check out this awesome code snippet I created with CodeCandy!\n\n🚀 Create your own beautiful code snippets at ${websiteUrl}\n\n#CodeCandy #coding #developer`);
                    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
                  }

                  // Show success toast
                  toast.success('Opening share dialog...', {
                    icon: '🔗',
                    style: {
                      background: '#1F2937',
                      color: '#F3F4F6',
                      border: '1px solid #374151',
                    },
                    duration: 3000
                  });
                } catch (error) {
                  console.error('Share error:', error);
                  toast.error('Failed to share code');
                }
              }}
              className="p-2 text-dark-300 hover:text-dark-100 hover:bg-dark-700/50 rounded-md transition-colors flex items-center gap-2"
              title="Share code"
            >
              <FiShare2 className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">Share</span>
            </motion.button>

            <div className="relative export-dropdown">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExportOptions(!showExportOptions);
                }}
                className="p-2 text-primary-400 hover:text-primary-300 hover:bg-primary-400/10 rounded-md transition-colors flex items-center gap-2"
                title="Export code"
              >
                <FiDownload className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Export</span>
              </motion.button>

              <AnimatePresence>
                {showExportOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-72 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4 space-y-4">
                      <div className="flex flex-col space-y-2">
                        <h3 className="text-sm font-medium text-dark-200">Export Options</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              handleExport();
                              setShowExportOptions(false);
                            }}
                            className="flex items-center gap-2 p-3 rounded-md bg-dark-700/50 hover:bg-dark-700 transition-colors text-dark-200 hover:text-dark-100"
                          >
                            <FiImage className="w-4 h-4" />
                            <span className="text-sm">PNG Image</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              handleCopyCode();
                              setShowExportOptions(false);
                            }}
                            className="flex items-center gap-2 p-3 rounded-md bg-dark-700/50 hover:bg-dark-700 transition-colors text-dark-200 hover:text-dark-100"
                          >
                            <FiClipboard className="w-4 h-4" />
                            <span className="text-sm">Copy Code</span>
                          </motion.button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-dark-300 block mb-1">Image Scale</label>
                          <select
                            value={exportSettings.scale}
                            onChange={(e) => setExportSettings(prev => ({ ...prev, scale: Number(e.target.value) }))}
                            className="w-full bg-dark-700 border border-dark-600 rounded-md px-2 py-1.5 text-sm text-dark-100"
                          >
                            <option value="1">1x (Normal)</option>
                            <option value="2">2x (HD)</option>
                            <option value="3">3x (Ultra HD)</option>
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
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              tabSize: 4,
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