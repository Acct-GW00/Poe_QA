
import React, { useState } from 'react';
import { WELCOME_TITLE, WELCOME_INTRO, HELP_ITEMS, EXAMPLE_QUESTIONS_TITLE, EXAMPLE_QUESTIONS, CLOSING_REMARK } from '../constants';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface WelcomeMessageProps {
    onStartQuiz: () => void;
    onSendMessage: (message: string) => void;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onStartQuiz, onSendMessage }) => {
    const [isInfoOpen, setIsInfoOpen] = useState(true);
    const [isExamplesOpen, setIsExamplesOpen] = useState(false);

    return (
        <>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl mb-6 shadow-lg">
                <button
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    className="w-full flex justify-between items-center p-4 md:p-5 text-left"
                    aria-expanded={isInfoOpen}
                    aria-controls="info-content"
                >
                    <h2 className="text-lg font-semibold text-cyan-300">{WELCOME_TITLE}</h2>
                    <ChevronDownIcon
                        className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isInfoOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                <div
                    id="info-content"
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isInfoOpen ? 'max-h-[2000px]' : 'max-h-0'}`}
                >
                    <div className="px-4 md:px-5 pb-5 pt-0">
                        <p className="text-gray-100 mb-6">{WELCOME_INTRO}</p>

                        <div className="space-y-5">
                            {HELP_ITEMS.map((item, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold text-cyan-400 mb-1">{item.title}</h3>
                                    <p className="text-gray-100">{item.content}</p>
                                    {item.isQuizButton ? (
                                        <button
                                            onClick={onStartQuiz}
                                            className='text-red-500 hover:text-red-400 animate-blink font-bold hover:underline transition-colors duration-200 mt-1 inline-block'
                                        >
                                            {item.linkText}
                                        </button>
                                    ) : item.link && (
                                         <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`hover:underline transition-colors duration-200 mt-1 inline-block ${
                                                (item.linkText === '操作手冊下載點' || item.linkText === '影片觀賞')
                                                ? 'text-red-500 hover:text-red-400 animate-blink font-bold'
                                                : 'text-blue-400 hover:text-blue-300'
                                            }`}
                                        >
                                            {item.linkText}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl mb-6 shadow-lg">
                 <button
                    onClick={() => setIsExamplesOpen(!isExamplesOpen)}
                    className="w-full flex justify-between items-center p-4 md:p-5 text-left"
                    aria-expanded={isExamplesOpen}
                    aria-controls="examples-content"
                >
                    <h2 className="text-lg font-semibold text-cyan-300">{EXAMPLE_QUESTIONS_TITLE}</h2>
                    <ChevronDownIcon
                        className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExamplesOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                <div
                    id="examples-content"
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isExamplesOpen ? 'max-h-[2000px]' : 'max-h-0'}`}
                >
                    <div className="px-4 md:px-5 pb-5 pt-4">
                        <ul className="list-none space-y-2 text-gray-200">
                            {EXAMPLE_QUESTIONS.map((q, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => onSendMessage(q)}
                                        className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        aria-label={`Ask: ${q}`}
                                    >
                                        {q}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            
            <p className="text-center text-lg text-yellow-200 mb-6">{CLOSING_REMARK}</p>
        </>
    );
};
