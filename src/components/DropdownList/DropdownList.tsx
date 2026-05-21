import { useState, useRef, useEffect } from 'react';
import './DropdownList.css';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownListProps {
  options: DropdownOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
}

export function DropdownList({
  options,
  placeholder = 'Select an option…',
  value,
  onChange,
  label,
}: DropdownListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(filterText.toLowerCase())
  );

  function handleToggle() {
    setIsOpen((prev) => !prev);
    setFilterText('');
  }

  function handleSelect(option: DropdownOption) {
    onChange?.(option.value);
    setIsOpen(false);
    setFilterText('');
  }

  // Close when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFilterText('');
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  return (
    <div className="dropdown" ref={containerRef}>
      {label && <label className="dropdown__label">{label}</label>}
      <button
        type="button"
        className="dropdown__trigger"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedLabel ? '' : 'dropdown__placeholder'}>
          {selectedLabel || placeholder}
        </span>
        <span className={`dropdown__arrow ${isOpen ? 'dropdown__arrow--open' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="dropdown__panel" role="listbox">
          <input
            ref={inputRef}
            className="dropdown__filter"
            type="text"
            placeholder="Type to filter…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <ul className="dropdown__list">
            {filtered.length > 0 ? (
              filtered.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  className={`dropdown__item ${option.value === value ? 'dropdown__item--selected' : ''}`}
                  onMouseDown={() => handleSelect(option)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="dropdown__empty">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
