
import React from 'react';

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    icon?: React.ElementType;
    type?: string;
    required?: boolean;
    placeholder?: string;
    textarea?: boolean;
    rows?: number;
}

export const InputField: React.FC<InputFieldProps> = 
({ label, name, value, onChange, icon: Icon, type = 'text', required = false, placeholder = '', textarea = false, rows = 3 }) => {
    const commonClasses = `w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500`;

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>}
                {textarea ? (
                    <textarea
                        id={name}
                        name={name}
                        value={value}
                        onChange={onChange}
                        required={required}
                        placeholder={placeholder}
                        rows={rows}
                        className={commonClasses}
                    ></textarea>
                ) : (
                    <input
                        id={name}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        required={required}
                        placeholder={placeholder}
                        className={commonClasses}
                    />
                )}
            </div>
        </div>
    );
};
