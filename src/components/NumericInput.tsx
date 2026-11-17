import React, { useState, useEffect } from 'react';

interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number | string | undefined;
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
  const [localValue, setLocalValue] = useState(value?.toString() ?? '');

  useEffect(() => {
    const parsedLocal = parseFloat(localValue);
    if (isNaN(parsedLocal) || parsedLocal !== value) {
      setLocalValue(value?.toString() ?? '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(',', '.');

    if (val === '' || val === '-') {
      setLocalValue(val);
      onChange(0);
      return;
    }

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
      inputMode={allowFloat ? 'decimal' : 'numeric'}
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:outline-none transition-colors ${className || ''}`}
      {...props}
    />
  );
};
