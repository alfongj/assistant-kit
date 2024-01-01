import React from 'react';

interface InitialPromptsProps {
  examples: string[];
  setInput: (input: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

const InitialPrompts: React.FC<InitialPromptsProps> = ({ examples, setInput, inputRef }) => (
  <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
    {examples.map((example, i) => (
      <button
        key={i}
        className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50"
        onClick={() => {
          setInput(example);
          inputRef.current?.focus();
        }}
      >
        {example}
      </button>
    ))}
  </div>
);

export default InitialPrompts;