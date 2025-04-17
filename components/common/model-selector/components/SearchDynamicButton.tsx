'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import useClickOutside from '@/app/hooks/use-click-outside';
import { ArrowLeft, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';

const transition = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.2,
};

function Button({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      className='relative flex h-7 w-7 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

interface SearchDynamicButtonProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  initialWidth?: string;
  expandedWidth?: string;
}

export default function SearchDynamicButton({
  placeholder = "Search",
  onSearch,
  className = "",
  initialWidth = "36px",
  expandedWidth = "160px"
}: SearchDynamicButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when isOpen changes to true
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Slight delay to ensure animation has started
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handler for outside clicks
  useClickOutside(containerRef, () => {
    if (isOpen) {
      setIsOpen(false);
      setSearchQuery("");
      onSearch?.("");
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchQuery("");
      onSearch?.("");
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsOpen(false);
    setSearchQuery("");
    onSearch?.("");
  };

  const handleOpenClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsOpen(true);
  };

  return (
    <MotionConfig transition={transition}>
      <div className={`relative ${className}`} ref={containerRef}>
        <motion.div
          className='rounded-md border border-border bg-background'
          animate={{
            width: isOpen ? expandedWidth : initialWidth,
          }}
          initial={false}
        >
          <div className='overflow-hidden p-1'>
            {!isOpen ? (
              <div className='flex'>
                <Button
                  onClick={handleOpenClick}
                  ariaLabel={`Search ${placeholder}`}
                >
                  <MagnifyingGlass className='h-4 w-4' />
                </Button>
              </div>
            ) : (
              <div className='flex space-x-1 items-center'>
                <Button
                  onClick={handleBackClick}
                  ariaLabel='Back'
                >
                  <ArrowLeft className='h-4 w-4' />
                </Button>
                <div className='relative w-full' onClick={e => e.stopPropagation()}>
                  <input
                    ref={inputRef}
                    className='h-7 w-full rounded-md bg-transparent px-2 text-foreground placeholder-muted-foreground text-sm focus:outline-none'
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
