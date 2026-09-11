import React, { useState, useEffect } from 'react';

interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  allowFloat?: boolean;
}

export const NumericInput: React.FC<NumericInputProps> = ({ 
  value, 
  onChange, 
  allowFloat = true,
  className,
  ...props 
}) => {
  const [localValue, setLocalValue] = useState(value.toString());

  // Sync with external state changes
  useEffect(() => {
    const parsedLocal = parseFloat(localValue);
    if (isNaN(parsedLocal) || parsedLocal !== value) {
      // Only update if the external value is meaningfully different 
      // from what we're typing, to avoid wiping out trailing decimals
      setLocalValue(value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(',', '.'); // Allow comma as decimal separator
    
    // allow empty string or minus sign temporarily
    if (val === '' || val === '-') {
      setLocalValue(val);
      // We can optionally push a 0 to the parent state when empty, 
      // or let the parent keep the old value until blur. Let's push 0.
      onChange(0);
      return;
    }
    
    // Check if it's a valid number format
    const regex = allowFloat ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
    if (regex.test(val)) {
      setLocalValue(val);
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let finalVal = parseFloat(localValue);
    if (isNaN(finalVal)) {
      finalVal = 0;
    }
    setLocalValue(finalVal.toString());
    onChange(finalVal);
    
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return (
    <input
      type="text"
      inputMode={allowFloat ? "decimal" : "numeric"}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none transition-colors ${className || ''}`}
      {...props}
    />
  );
};
