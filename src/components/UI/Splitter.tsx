import React, { useRef, useEffect, useState } from 'react';

interface SplitterProps {
  direction: 'horizontal' | 'vertical';
  onResize?: (size: number) => void;
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
}

export function Splitter({
  direction,
  onResize,
  initialSize = 300,
  minSize = 200,
  maxSize = 800
}: SplitterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState(initialSize);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newSize: number;

      if (direction === 'horizontal') {
        newSize = e.clientX - rect.left;
      } else {
        newSize = e.clientY - rect.top;
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
      onResize?.(newSize);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, direction, minSize, maxSize, onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const splitterClasses = direction === 'horizontal'
    ? 'w-1 cursor-col-resize hover:bg-blue-500 bg-gray-700'
    : 'h-1 cursor-row-resize hover:bg-blue-500 bg-gray-700';

  return (
    <div
      ref={containerRef}
      className={`relative ${splitterClasses} transition-colors`}
      onMouseDown={handleMouseDown}
    >
      <div className={`absolute inset-0 ${isDragging ? 'bg-blue-500' : ''}`} />
    </div>
  );
}