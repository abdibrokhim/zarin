"use client"

import { useState, useEffect, useRef, MouseEvent } from 'react'
import { X, CornersOut, CornersIn, SquaresFour, PencilSimple, Play } from '@phosphor-icons/react/dist/ssr'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

// CodeMirror imports - Use consistent versions to prevent duplication
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

// Import languages
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'
import { cpp } from '@codemirror/lang-cpp'
import { markdown } from '@codemirror/lang-markdown'
import { php } from '@codemirror/lang-php'
import { sql } from '@codemirror/lang-sql'

// Import theme and basic setup
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup } from 'codemirror'

interface DevModeWindowProps {
  code: string
  language: string
  isOpen: boolean
  onClose: () => void
}

// Language groups for better execution handling
const JS_LANGUAGES = ['javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx']
const HTML_LANGUAGES = ['html', 'htm']
const CSS_LANGUAGES = ['css', 'scss', 'sass', 'less']
const PYTHON_LANGUAGES = ['python', 'py']
const RUST_LANGUAGES = ['rust', 'rs']
const CPP_LANGUAGES = ['cpp', 'c', 'c++', 'h', 'hpp']
const MARKDOWN_LANGUAGES = ['markdown', 'md']
const PHP_LANGUAGES = ['php']
const SQL_LANGUAGES = ['sql']

// Get language extension based on the language
const getLanguageExtension = (lang: string) => {
  const language = lang.toLowerCase();
  
  if (JS_LANGUAGES.includes(language)) return javascript();
  if (HTML_LANGUAGES.includes(language)) return html();
  if (CSS_LANGUAGES.includes(language)) return css();
  if (PYTHON_LANGUAGES.includes(language)) return python();
  if (RUST_LANGUAGES.includes(language)) return rust();
  if (CPP_LANGUAGES.includes(language)) return cpp();
  if (MARKDOWN_LANGUAGES.includes(language)) return markdown();
  if (PHP_LANGUAGES.includes(language)) return php();
  if (SQL_LANGUAGES.includes(language)) return sql();
  
  // Default to javascript for unknown languages
  return javascript();
};

// CodeMirror wrapper component
function CodeMirrorEditor({ 
  code, 
  language, 
  onChange 
}: { 
  code: string; 
  language: string; 
  onChange?: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!editorRef.current) return;
    
    // Clear any existing content
    editorRef.current.innerHTML = '';
    
    try {
      const languageExtension = getLanguageExtension(language);
      
      const view = new EditorView({
        state: EditorState.create({
          doc: code || ' ', // Use a space if code is empty to ensure editor renders
          extensions: [
            basicSetup,
            languageExtension,
            theme === 'dark' ? oneDark : [],
            EditorView.updateListener.of((update: any) => {
              if (update.docChanged && onChange) {
                onChange(update.state.doc.toString());
              }
            }),
            EditorView.theme({
              "&": {
                height: "100%",
                maxHeight: "100%",
                fontSize: "13px"
              },
              ".cm-scroller": {
                overflow: "auto",
                fontFamily: "monospace"
              },
              ".cm-content": {
                minHeight: "100px"
              }
            })
          ]
        }),
        parent: editorRef.current
      });
      
      return () => {
        view.destroy();
      };
    } catch (error) {
      console.error("Error initializing CodeMirror:", error);
      
      // Fallback to plain textarea if CodeMirror fails
      const textarea = document.createElement('textarea');
      textarea.value = code || '';
      textarea.className = 'w-full h-full p-4 font-mono text-sm resize-none';
      textarea.onchange = (e) => {
        onChange?.((e.target as HTMLTextAreaElement).value);
      };
      
      editorRef.current.appendChild(textarea);
    }
  }, [code, language, theme, onChange]);
  
  return (
    <div ref={editorRef} className="h-full w-full overflow-auto p-0 border-0" style={{ minHeight: "100px" }} />
  );
}

export function DevModeWindow({ code, language, isOpen, onClose }: DevModeWindowProps) {
  const { theme } = useTheme()
  const [output, setOutput] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('html')
  
  // For HTML + CSS + JS playground
  const [htmlCode, setHtmlCode] = useState<string>('')
  const [cssCode, setCssCode] = useState<string>('')
  const [jsCode, setJsCode] = useState<string>('')
  const [currentCode, setCurrentCode] = useState<string>('')
  const [isPlaygroundMode, setIsPlaygroundMode] = useState(false)
  
  // Custom draggable implementation
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  const outputRef = useRef<HTMLDivElement>(null)

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    if (containerRef.current) {
      setIsDragging(true);
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep the element within the viewport bounds
      const maxX = window.innerWidth - containerRef.current.offsetWidth;
      const maxY = window.innerHeight - containerRef.current.offsetHeight;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove as any);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isOpen, isDragging, dragOffset]);

  // Initialize code based on language
  useEffect(() => {
    if (!isOpen) return;
    
    // Log the incoming code for debugging
    console.log(`DevModeWindow: Initializing with code length ${code?.length || 0}, language: ${language}`);
    
    setCurrentCode(code || '');
    
    if (HTML_LANGUAGES.includes(language.toLowerCase())) {
      setHtmlCode(code || '');
      setActiveTab('html');
      setIsPlaygroundMode(true);
    } else if (CSS_LANGUAGES.includes(language.toLowerCase())) {
      setCssCode(code || '');
      setActiveTab('css');
      setIsPlaygroundMode(true);
    } else if (JS_LANGUAGES.includes(language.toLowerCase())) {
      setJsCode(code || '');
      setActiveTab('js');
      setIsPlaygroundMode(false);
    } else {
      // For other languages, disable playground mode
      setIsPlaygroundMode(false);
    }
  }, [code, language, isOpen]);

  const executePlayground = () => {
    if (!outputRef.current) return;
    
    // Create a complete HTML document with CSS and JS
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch (error) {
              console.error('Error:', error);
            }
          </script>
        </body>
      </html>
    `;
    
    const iframe = document.createElement('iframe');
    iframe.srcdoc = htmlContent;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    outputRef.current.innerHTML = '';
    outputRef.current.appendChild(iframe);
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput('');
    
    try {
      if (isPlaygroundMode) {
        executePlayground();
        return;
      }
      
      // Different execution strategies based on language
      if (JS_LANGUAGES.includes(language.toLowerCase())) {
        // Create a sandbox for JavaScript execution
        const originalConsoleLog = console.log;
        const logs: string[] = [];
        
        // Override console.log to capture output
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };
        
        try {
          // Execute the code using Function constructor (safer than eval)
          const func = new Function(currentCode);
          await func();
          setOutput(logs.join('\n'));
        } catch (err: any) {
          setOutput(`Error: ${err.message}`);
        } finally {
          // Restore original console.log
          console.log = originalConsoleLog;
        }
      } else if (HTML_LANGUAGES.includes(language.toLowerCase())) {
        // For HTML, create an iframe
        const iframeContent = `
          <html>
            <head>
              <style>
                body { margin: 0; font-family: sans-serif; }
              </style>
            </head>
            <body>${currentCode}</body>
          </html>
        `;
        
        const iframe = document.createElement('iframe');
        iframe.srcdoc = iframeContent;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        if (outputRef.current) {
          outputRef.current.innerHTML = '';
          outputRef.current.appendChild(iframe);
        }
      } else if (PYTHON_LANGUAGES.includes(language.toLowerCase())) {
        setOutput("Python execution is not supported in the browser. This is a syntax highlighting preview only.");
      } else if (RUST_LANGUAGES.includes(language.toLowerCase())) {
        setOutput("Rust execution is not supported in the browser. This is a syntax highlighting preview only.");
      } else {
        setOutput(`Execution for ${language} is not supported in the browser. This is a syntax highlighting preview only.`);
      }
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Toggle playground mode
  const togglePlaygroundMode = () => {
    // Only allow playground mode for HTML/CSS/JS
    if (!HTML_LANGUAGES.includes(language.toLowerCase()) && 
        !CSS_LANGUAGES.includes(language.toLowerCase()) && 
        !JS_LANGUAGES.includes(language.toLowerCase())) {
      setOutput("Playground mode is only available for HTML, CSS, and JavaScript");
      return;
    }
    
    setIsPlaygroundMode(!isPlaygroundMode);
    
    if (!isPlaygroundMode) {
      // Set appropriate code in playground based on current language
      if (JS_LANGUAGES.includes(language.toLowerCase())) {
        setJsCode(currentCode);
      } else if (HTML_LANGUAGES.includes(language.toLowerCase())) {
        setHtmlCode(currentCode);
      } else if (CSS_LANGUAGES.includes(language.toLowerCase())) {
        setCssCode(currentCode);
      }
    } else {
      // When switching back from playground, use current edited code if any
      setCurrentCode(
        JS_LANGUAGES.includes(language.toLowerCase()) 
          ? jsCode 
          : HTML_LANGUAGES.includes(language.toLowerCase())
            ? htmlCode
            : cssCode
      );
    }
  };

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setOutput('');
      setIsMaximized(false);
      setPosition({ x: 50, y: 50 });
    }
  }, [isOpen]);

  // Effect to handle tab changes in playground mode
  useEffect(() => {
    if (isPlaygroundMode) {
      switch (activeTab) {
        case 'html':
          setCurrentCode(htmlCode);
          break;
        case 'css':
          setCurrentCode(cssCode);
          break;
        case 'js':
          setCurrentCode(jsCode);
          break;
      }
    }
  }, [activeTab, isPlaygroundMode]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-50 bg-card border rounded-lg shadow-lg overflow-hidden",
        isMaximized ? "w-[90vw] h-[90vh] top-[5vh] left-[5vw]" : "w-[600px] h-[500px]"
      )}
      style={
        isMaximized 
          ? { transition: "all 0.2s ease-in-out" }
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              transition: isDragging ? "none" : "all 0.2s ease-in-out",
            }
      }
    >
      {/* Header for dragging */}
      <div
        className="bg-muted p-2 flex justify-between items-center cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="text-sm font-medium flex items-center">
          <span>Zarin Mode: {language}</span>
        </div>
        <div className="flex items-center space-x-1">
          {(HTML_LANGUAGES.includes(language.toLowerCase()) || 
            CSS_LANGUAGES.includes(language.toLowerCase()) || 
            JS_LANGUAGES.includes(language.toLowerCase())) && (
            <button
              onClick={togglePlaygroundMode}
              className={cn(
                "rounded-sm p-1.5 hover:bg-accent",
                isPlaygroundMode && "text-primary"
              )}
              title="Toggle Playground Mode"
            >
              <SquaresFour className="h-4 w-4" />
            </button>
          )}
          {isMaximized ? (
            <button
              onClick={() => setIsMaximized(false)}
              className="rounded-sm p-1.5 hover:bg-accent"
            >
              <CornersIn className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsMaximized(true)}
              className="rounded-sm p-1.5 hover:bg-accent"
            >
              <CornersOut className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-sm p-1.5 hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 h-[calc(100%-40px)]">
        {isPlaygroundMode ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 h-full">
            <div className="flex items-center bg-muted border-b border-border">
              <TabsList className="h-9 p-0 bg-transparent">
                <TabsTrigger value="html" className="px-3 h-9 rounded-none">HTML</TabsTrigger>
                <TabsTrigger value="css" className="px-3 h-9 rounded-none">CSS</TabsTrigger>
                <TabsTrigger value="js" className="px-3 h-9 rounded-none">JavaScript</TabsTrigger>
              </TabsList>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <button
                onClick={executePlayground}
                disabled={isRunning}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-md text-xs font-medium ml-auto mr-2 flex items-center gap-1"
              >
                <Play className="h-3 w-3" />
                {isRunning ? 'Running...' : 'Run'}
              </button>
            </div>
            
            <TabsContent value="html" className="flex-1 overflow-hidden mt-0 p-0 h-[calc(100%-40px)]">
              <CodeMirrorEditor
                code={htmlCode}
                language="html"
                onChange={setHtmlCode}
              />
            </TabsContent>
            
            <TabsContent value="css" className="flex-1 overflow-hidden mt-0 p-0 h-[calc(100%-40px)]">
              <CodeMirrorEditor
                code={cssCode}
                language="css"
                onChange={setCssCode}
              />
            </TabsContent>
            
            <TabsContent value="js" className="flex-1 overflow-hidden mt-0 p-0 h-[calc(100%-40px)]">
              <CodeMirrorEditor
                code={jsCode}
                language="javascript"
                onChange={setJsCode}
              />
            </TabsContent>
            
            <div className="border-t border-border">
              <div className="flex items-center bg-muted p-2">
                <span className="text-xs font-medium">Output</span>
              </div>
              <div 
                ref={outputRef}
                className="p-0 h-32 overflow-auto"
              >
                <div className="p-2 text-sm text-muted-foreground">
                  Click "Run" to see the result
                </div>
              </div>
            </div>
          </Tabs>
        ) : (
          <>
            <div className="flex-1 overflow-hidden">
              <CodeMirrorEditor
                code={currentCode}
                language={language}
                onChange={setCurrentCode}
              />
            </div>
            
            <div className="border-t border-border">
              <div className="flex items-center justify-between bg-muted p-2">
                <span className="text-xs font-medium">Output</span>
                <button
                  onClick={executeCode}
                  disabled={isRunning}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1"
                >
                  <Play className="h-3 w-3" />
                  {isRunning ? 'Running...' : 'Run'}
                </button>
              </div>
              <div 
                ref={outputRef}
                className="p-2 h-24 overflow-auto font-mono text-xs whitespace-pre-wrap"
              >
                {output}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 