import React from 'react';

const WelcomeMessage = () => (
  <div className="flex flex-col space-y-4 p-7 sm:p-10">
    <h1 className="text-lg font-semibold text-black">
      Hi! This is {process.env.NEXT_PUBLIC_ASSISTANT_NAME}!
    </h1>
    <p className="text-gray-500">
      {process.env.NEXT_PUBLIC_ASSISTANT_INTRO}
    </p>
  </div>
);

export default WelcomeMessage;