import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  trigger, 
  items, 
  align = 'right',
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`
            absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-1 min-w-40 z-9999
            animate-in fade-in zoom-in-95 duration-100
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          <div className="flex flex-col gap-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`
                  flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors w-full text-left
                  ${item.variant === 'danger' 
                    ? 'text-red-600 hover:bg-red-50' 
                    : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

