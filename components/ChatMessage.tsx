
import React from 'react';
import { Message, Role } from '../types';
import { UserIcon } from './icons/UserIcon';
import { RobotIcon } from './icons/RobotIcon';

interface ChatMessageProps {
  message: Message;
}

const disclaimerText = "本系統為人工智能，僅提供輔助性質的資訊，若問題有不明之處，建議洽詢相關的審核人員，最終決策仍以會計審核員的意見為主。";

const renderAiMessage = (text: string) => {
    // 1. Remove any unwanted markdown characters like asterisks.
    const cleanText = text.replace(/\*/g, '');

    // 2. Separate the main content from the disclaimer.
    const textParts = cleanText.split(disclaimerText);
    const mainContent = textParts[0];
    const hasDisclaimer = textParts.length > 1;
    
    // 3. Process the main content to find and render markdown-style links.
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const linkParts = mainContent.split(linkRegex);

    const renderedContent = linkParts.map((part, index) => {
        // This logic correctly handles the array produced by `split` with a regex.
        if (index % 3 === 1) { // This part is the link text.
            const url = linkParts[index + 1]; // The next part is the URL.
            return (
                <a
                    key={`link-${index}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300 animate-blink font-bold underline"
                >
                    {part}
                </a>
            );
        }
        if (index % 3 === 2) { // This is the URL part, which we've already used.
            return null;
        }
        return part; // This is a regular text segment.
    });

    // 4. Return the processed content and the specially styled disclaimer.
    return (
        <>
            {renderedContent}
            {hasDisclaimer && (
                <p className="mt-4 font-bold text-pink-400">
                    {disclaimerText}
                </p>
            )}
        </>
    );
};


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  const containerClasses = `flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`;
  const bubbleClasses = `relative max-w-xl rounded-2xl px-4 py-3 shadow-lg ${
    isUser
      ? 'bg-blue-600 text-white rounded-br-none'
      : 'bg-gray-800 text-gray-200 rounded-bl-none'
  }`;

  const iconClasses = `w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${
      isUser ? 'bg-blue-500 text-white' : 'bg-gray-700 text-cyan-400'
  }`;

  const Icon = isUser ? UserIcon : RobotIcon;
  

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className={iconClasses}>
            <Icon className="w-5 h-5"/>
        </div>
      )}
      <div className={bubbleClasses}>
        <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
            {isUser ? message.text : renderAiMessage(message.text)}
        </div>
      </div>
       {isUser && (
        <div className={iconClasses}>
            <Icon className="w-5 h-5"/>
        </div>
      )}
    </div>
  );
};
