import React, { useId } from 'react';
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

/**
 * Componente Dropdown utilizando el nuevo API de Popover de CSS nativo.
 * Nota: Requiere navegadores modernos que soporten popovertarget.
 */
export const Dropdown: React.FC<DropdownProps> = ({ 
  trigger, 
  items, 
  align = 'right',
  className = '' 
}) => {
  const popoverId = useId().replace(/:/g, '');

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger Button con popovertarget */}
      <div 
        // @ts-ignore - Atributo popovertarget es de CSS moderno
        popovertarget={popoverId}
        style={{ cursor: 'pointer' }}
      >
        {trigger}
      </div>

      {/* Popover Menu */}
      <div 
        id={popoverId} 
        // @ts-ignore - Atributo popover es de CSS moderno
        popover="auto"
        className={`
          bg-white border border-gray-200 rounded-lg shadow-xl p-1 min-w-40
          m-0 opacity-0 transition-opacity duration-200
          backdrop:bg-transparent
          [&:popover-open]:opacity-100
        `}
        style={{
          inset: 'unset',
          top: 'anchor(bottom)',
          margin: '0.5rem 0 0 0',
          position: 'absolute',
          right: align === 'right' ? '0' : 'auto',
          left: align === 'left' ? '0' : 'auto',
        }}
      >
        <div className="flex flex-col gap-1">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                // Cerrar el popover manualmente tras el click
                const popover = document.getElementById(popoverId);
                if (popover) (popover as any).hidePopover();
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
    </div>
  );
};
