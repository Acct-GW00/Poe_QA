
import React, { useState, useRef } from 'react';
import { SendIcon } from './icons/SendIcon';
import { BroomIcon } from './icons/BroomIcon';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onClearContext: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onClearContext, isLoading }) => {
  const [input, setInput] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-2">
      <button
        type="button"
        onClick={onClearContext}
        disabled={isLoading}
        className="p-2.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        aria-label="Clear chat context"
        title="清除上下文"
      >
        <BroomIcon className="w-5 h-5" />
      </button>

      <div className="relative flex-1">
        <textarea
          ref={textAreaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="請在這裡輸入您的問題..."
          rows={1}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 pr-12 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 resize-none overflow-y-auto max-h-40"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-600 hover:bg-cyan-500 rounded-full text-white transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
