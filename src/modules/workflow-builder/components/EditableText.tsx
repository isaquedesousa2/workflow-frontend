'use client';

import { FC, useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface EditableTextProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export const EditableText: FC<EditableTextProps> = ({ value, onChange, className }) => {
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <Input
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`text-black bg-transparent border-none focus-visible:ring-0 focus:outline-none ${className}`}
            />
        );
    }

    return (
        <div onClick={handleClick} className={`cursor-pointer hover:opacity-80 transition-opacity ${className}`}>
            {value || 'Clique para editar'}
        </div>
    );
};
