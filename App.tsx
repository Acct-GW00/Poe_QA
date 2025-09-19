
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { WelcomeMessage } from './components/WelcomeMessage';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { createChatSession } from './services/geminiService';
import { logInteraction } from './services/loggingService';
import { Message, Role } from './types';
import { SYSTEM_PROMPT } from './constants';
import { RobotIcon } from './components/icons/RobotIcon';
import { Quiz } from './components/Quiz';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const initializeChat = useCallback(() => {
    const chat = createChatSession(SYSTEM_PROMPT);
    chatRef.current = chat;
    setMessages([]);
  }, []);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = { role: Role.USER, text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        throw new Error("Chat session not initialized.");
      }
      const result = await chatRef.current.sendMessage({ message: userInput });
      const aiMessage: Message = { role: Role.AI, text: result.text };
      
      logInteraction(userInput, result.text);

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: Role.AI,
        text: "抱歉，我現在無法回覆。請稍後再試一次。",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearContext = () => {
    initializeChat();
  };

  return (
    <div className="bg-black text-gray-200 font-sans flex flex-col h-screen">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-center space-x-3">
            <RobotIcon className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-biaukai font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            國內出差旅費智能問答
            </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-4xl">
            {messages.length === 0 && <WelcomeMessage onStartQuiz={() => setIsQuizActive(true)} onSendMessage={handleSendMessage} />}
            <div className="space-y-6">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 rounded-lg p-3 max-w-lg flex items-center space-x-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-0"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                        </div>
                    </div>
                )}
            </div>
            <div ref={chatBottomRef} />
        </div>
      </main>

      <footer className="sticky bottom-0 bg-black/90 backdrop-blur-sm pt-2">
        <div className="container mx-auto max-w-4xl px-4 pb-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              onClearContext={handleClearContext}
              isLoading={isLoading}
            />
        </div>
      </footer>

      {isQuizActive && <Quiz onClose={() => setIsQuizActive(false)} />}
    </div>
  );
};

export default App;
