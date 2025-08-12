"use client";

import { useEffect, useState } from 'react';

interface AnimatedHeroHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedHeroHeading({ children, className = "" }: AnimatedHeroHeadingProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Small delay for better UX

    return () => clearTimeout(timer);
  }, []);

  // Convert children to string and handle line breaks
  const getTextLines = (children: React.ReactNode): string[] => {
    if (typeof children === 'string') {
      return children.split('\n').filter(line => line.trim());
    }
    
    // Handle multiple children (like text nodes)
    if (Array.isArray(children)) {
      return children
        .map(child => typeof child === 'string' ? child.trim() : '')
        .filter(text => text);
    }

    // Fallback
    return [children?.toString() || ''];
  };

  const lines = getTextLines(children);
  const fullText = lines.join(' ');

  return (
    <h1 className={`hero-heading-animated ${className}`}>
      {isVisible ? (
        <>
          {lines.map((line, index) => (
            <div key={index} className="typing-text">
              {line}
            </div>
          ))}
          <div className="gradient-sweep">
            {fullText}
          </div>
        </>
      ) : (
        <span style={{ opacity: 0 }}>
          {fullText}
        </span>
      )}
    </h1>
  );
}
