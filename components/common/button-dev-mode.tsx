"use client"

import { Code } from '@phosphor-icons/react/dist/ssr'
import { memo, useRef, useState } from 'react';
import { DevModeWindow } from './dev-mode-window';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface ButtonDevModeProps {
    code: string
    language: string
}
  
function PureButtonDevMode({ code, language }: ButtonDevModeProps) {
    const [isDevModeOpen, setIsDevModeOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleRunClick = () => {
        // Log the code being passed for debugging
        console.log(`Opening dev mode with code length: ${code?.length || 0}`, { language });
        setIsDevModeOpen(true);
    }
    
    return (
      <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={buttonRef}
            onClick={handleRunClick}
            className="flex h-7 w-7 items-center justify-center rounded-md text-sm hover:bg-muted"
            title="Open in Zarin Mode"
        >
          <Code className="h-3.5 w-3.5" />
        </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Open in Zarin Mode</p>
        </TooltipContent>
      </Tooltip>
        
        {isDevModeOpen && (
          <DevModeWindow 
            code={code || ''}
            language={language}
            isOpen={isDevModeOpen}
            onClose={() => setIsDevModeOpen(false)}
          />
        )}
      </>
    )
}

export const ButtonDevMode = memo(PureButtonDevMode, (prevProps, nextProps) => {
  return prevProps.code === nextProps.code && prevProps.language === nextProps.language
})