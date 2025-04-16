"use client"

import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { GlowEffect, GlowEffectProps } from '@/components/motion-primitives/glow-effect';

interface ButtonWithGlowEffectProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  glowConfig?: Partial<GlowEffectProps>;
  containerClassName?: string;
}

function ButtonWithGlowEffect({
  children,
  className,
  glowConfig,
  containerClassName,
  ...props
}: ButtonWithGlowEffectProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <GlowEffect
        colors={['#FF69B4', '#FF1493', '#FF00FF', '#FF69B4']}
        mode='colorShift'
        blur='soft'
        duration={3}
        scale={0.9}
        {...glowConfig}
      />
      <button
        className={cn(
          "relative inline-flex items-center gap-1 rounded-md bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-50 outline outline-1 outline-[#fff2f21f]",
          className
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}

export default ButtonWithGlowEffect;
