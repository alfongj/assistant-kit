"use client";

import { useEffect, useRef } from "react";
import { experimental_useAssistant as useAssistant } from "ai/react";
import clsx from "clsx";
import { GithubIcon, LoadingCircle, SendIcon } from "./icons";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Textarea from "react-textarea-autosize";
// import { toast } from "sonner";

import WelcomeMessage from './components/welcome-message';
// import InitialPrompts from "./components/initial-prompts";

// const examples = [
//   "Get me the top 5 stories on Hacker News in markdown table format. Use columns like title, link, score, and comments.",
//   "Summarize the comments in the top hacker news story.",
//   "What is the top story on Hacker News right now?",
// ];

export default function Chat() {

  // setInput coming on next version of ai sdk
  const { status, messages, input, submitMessage, handleInputChange, error, /* setInput */ } =
    useAssistant({
      api: '/api/assistant',
    });

  // TODO do something with error
  if (error) {
    console.error(error);
  }
    
  // When status changes to accepting messages, focus the input:
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (status === 'awaiting_message') {
      inputRef.current?.focus();
    }
  }, [status]);

  return (
    <main className="flex flex-col items-center justify-between pb-40">
      <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
        
        <a
          href="/github"
          target="_blank"
          className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
        >
          <GithubIcon />
        </a>
      </div>
      {messages.length > 0 ? (
        messages.map((message, i) => (
          <div
            key={i}
            className={clsx(
              "flex w-full items-center justify-center border-b border-gray-200 py-8",
              message.role === "user" ? "bg-white" : "bg-gray-100",
            )}
          >
            <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
              <div
                className={clsx(
                  "p-1.5 text-white",
                  message.role === "assistant" ? "bg-green-500" : "bg-black",
                )}
              >
                {message.role === "user" ? (
                  <User width={20} />
                ) : (
                  <Bot width={20} />
                )}
              </div>
              <ReactMarkdown
                className="prose mt-1 w-full break-words prose-p:leading-relaxed"
                remarkPlugins={[remarkGfm]}
                components={{
                  // open links in new tab
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">
          <WelcomeMessage />
          {/* <InitialPrompts examples={examples} setInput={setInput} inputRef={inputRef} /> */}
        </div>
      )}
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        <form
          ref={formRef}
          onSubmit={submitMessage}
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Send a message"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e: any) => {
              if (e.key === "Enter" && !e.shiftKey) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-10 focus:outline-none"
          />
          <button
            className={clsx(
              "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              status !== 'awaiting_message'
                ? "cursor-not-allowed bg-white"
                : "bg-green-500 hover:bg-green-600",
            )}
            disabled={status !== 'awaiting_message'}
          >
            {status === 'in_progress' ? (
              <LoadingCircle />
            ) : (
              <SendIcon
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white",
                )}
              />
            )}
          </button>
        </form>
        
      </div>
    </main>


    // <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
    //   {error != null && (
    //     <div className="relative bg-red-500 text-white px-6 py-4 rounded-md">
    //       <span className="block sm:inline">
    //         Error: {(error as any).toString()}
    //       </span>
    //     </div>
    //   )}

    //   {messages.map((m: Message) => (
    //     <div
    //       key={m.id}
    //       className="whitespace-pre-wrap"
    //       style={{ color: roleToColorMap[m.role] }}
    //     >
    //       <strong>{`${m.role}: `}</strong>
    //       {m.role !== 'data' && m.content}
    //       {m.role === 'data' && (
    //         <>
    //           {(m.data as any).description}
    //           <br />
    //           <pre className={'bg-gray-200'}>
    //             {JSON.stringify(m.data, null, 2)}
    //           </pre>
    //         </>
    //       )}
    //       <br />
    //       <br />
    //     </div>
    //   ))}

    //   {status === 'in_progress' && (
    //     <div className="h-8 w-full max-w-md p-2 mb-8 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse" />
    //   )}

      // <form onSubmit={submitMessage}>
      //   <input
      //     ref={inputRef}
      //     disabled={status !== 'awaiting_message'}
      //     className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
      //     value={input}
      //     placeholder="What is the temperature in the living room?"
      //     onChange={handleInputChange}
      //   />
      // </form>
    // </div>
  );
}




// export default function Chat() {


//   const disabled = isLoading || input.length === 0;

//   return (
//     <main className="flex flex-col items-center justify-between pb-40">
//       <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
//         <a
//           href="/deploy"
//           target="_blank"
//           className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
//         >
//           <VercelIcon />
//         </a>
//         <a
//           href="/github"
//           target="_blank"
//           className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
//         >
//           <GithubIcon />
//         </a>
//       </div>
//       {messages.length > 0 ? (
//         messages.map((message, i) => (
//           <div
//             key={i}
//             className={clsx(
//               "flex w-full items-center justify-center border-b border-gray-200 py-8",
//               message.role === "user" ? "bg-white" : "bg-gray-100",
//             )}
//           >
//             <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
//               <div
//                 className={clsx(
//                   "p-1.5 text-white",
//                   message.role === "assistant" ? "bg-green-500" : "bg-black",
//                 )}
//               >
//                 {message.role === "user" ? (
//                   <User width={20} />
//                 ) : (
//                   <Bot width={20} />
//                 )}
//               </div>
//               <ReactMarkdown
//                 className="prose mt-1 w-full break-words prose-p:leading-relaxed"
//                 remarkPlugins={[remarkGfm]}
//                 components={{
//                   // open links in new tab
//                   a: (props) => (
//                     <a {...props} target="_blank" rel="noopener noreferrer" />
//                   ),
//                 }}
//               >
//                 {message.content}
//               </ReactMarkdown>
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">
//           <div className="flex flex-col space-y-4 p-7 sm:p-10">
//             <h1 className="text-lg font-semibold text-black">
//               Welcome to ChatHN!
//             </h1>
//             <p className="text-gray-500">
//               This is an{" "}
//               <a
//                 href="https://github.com/alfongj/assistant-kit"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="font-medium underline underline-offset-4 transition-colors hover:text-black"
//               >
//                 open-source
//               </a>{" "}
//               AI chatbot that uses{" "}
//               <a
//                 href="https://platform.openai.com/docs/guides/gpt/function-calling"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="font-medium underline underline-offset-4 transition-colors hover:text-black"
//               >
//                 OpenAI Functions
//               </a>{" "}
//               and{" "}
//               <a
//                 href="https://sdk.vercel.ai/docs"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="font-medium underline underline-offset-4 transition-colors hover:text-black"
//               >
//                 Vercel AI SDK
//               </a>{" "}
//               to interact with the{" "}
//               <a
//                 href="https://github.com/HackerNews/API"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="font-medium underline underline-offset-4 transition-colors hover:text-black"
//               >
//                 Hacker News API
//               </a>{" "}
//               with natural language.
//             </p>
//           </div>
//           <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
//             {examples.map((example, i) => (
//               <button
//                 key={i}
//                 className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50"
//                 onClick={() => {
//                   setInput(example);
//                   inputRef.current?.focus();
//                 }}
//               >
//                 {example}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//       <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
//         <form
//           ref={formRef}
//           onSubmit={handleSubmit}
//           className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
//         >
//           <Textarea
//             ref={inputRef}
//             tabIndex={0}
//             required
//             rows={1}
//             autoFocus
//             placeholder="Send a message"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 formRef.current?.requestSubmit();
//                 e.preventDefault();
//               }
//             }}
//             spellCheck={false}
//             className="w-full pr-10 focus:outline-none"
//           />
//           <button
//             className={clsx(
//               "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
//               disabled
//                 ? "cursor-not-allowed bg-white"
//                 : "bg-green-500 hover:bg-green-600",
//             )}
//             disabled={disabled}
//           >
//             {isLoading ? (
//               <LoadingCircle />
//             ) : (
//               <SendIcon
//                 className={clsx(
//                   "h-4 w-4",
//                   input.length === 0 ? "text-gray-300" : "text-white",
//                 )}
//               />
//             )}
//           </button>
//         </form>
        
//       </div>
//     </main>
//   );
// }
