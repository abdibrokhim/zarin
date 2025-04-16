"use client"
import { Code } from '@phosphor-icons/react/dist/ssr'
import { memo, useRef } from 'react';

interface ButtonDevModeProps {
    code: string
    language: string
}
  
function PureButtonDevMode({ code, language }: ButtonDevModeProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleRunClick = () => {
        try {
            // Create a data URL with the code content
            const codeContent = typeof code === 'string' && code.trim() ? code : '// No code content';
            const fileExtension = getFileExtensionForLanguage(language);
            const filename = `code-snippet.${fileExtension}`;
            
            // Create blob and URL
            const blob = new Blob([codeContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            // Create download element
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.target = '_blank';
            a.click();
            
            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
            console.error("Error opening code:", error);
        }
    }
    
    // Map language to appropriate file extension
    const getFileExtensionForLanguage = (lang: string): string => {
        const extensionMap: Record<string, string> = {
            'javascript': 'js',
            'typescript': 'ts',
            'jsx': 'jsx',
            'tsx': 'tsx',
            'html': 'html',
            'css': 'css',
            'json': 'json',
            'python': 'py',
            'ruby': 'rb',
            'go': 'go',
            'rust': 'rs',
            'java': 'java',
            'c': 'c',
            'cpp': 'cpp',
            'csharp': 'cs',
            'php': 'php',
            'swift': 'swift',
            'kotlin': 'kt',
            'plaintext': 'txt'
        };
        
        return extensionMap[lang.toLowerCase()] || 'txt';
    }
  
    return (
      <button
        ref={buttonRef}
        onClick={handleRunClick}
        className="flex h-7 w-7 items-center justify-center rounded-md border bg-background text-sm hover:bg-muted"
        title="Open in Dev Mode"
      >
        <Code className="h-3.5 w-3.5" />
      </button>
    )
}

export const ButtonDevMode = memo(PureButtonDevMode, (prevProps, nextProps) => {
  return prevProps.code === nextProps.code && prevProps.language === nextProps.language
})