
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
    phoneNumber: string;
    label?: string;
    className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber, label = 'WhatsApp', className = '' }) => {
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    if (!formattedNumber) return null;
    
    return (
        <a 
            href={`https://wa.me/${formattedNumber}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`inline-flex items-center text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 ${className}`}
            title={`Chat with ${label} on WhatsApp`}
        >
            <MessageCircle className="w-4 h-4 mr-1" />
            {label}
        </a>
    );
};
