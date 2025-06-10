import React, { useEffect, useState } from 'react';

type Props = {
  sender: string;
  timeout?: number; // seconds
  onAccept: () => void;
  onReject: () => void;
};

const ReqPopUp: React.FC<Props> = ({ sender, timeout = 10, onAccept, onReject }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const totalTicks = timeout * 10;
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev - 100 / totalTicks;
        if (next <= 0) {
          clearInterval(interval);
          // Avoid setState during render by deferring onReject
          setTimeout(() => onReject(), 0);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [timeout, onReject]);

  return (
    <div className="top-10 fixed left-1/2 transform -translate-x-1/2 w-80 bg-white shadow-lg rounded-lg  overflow-hidden">
  {/* Top border progress */}
  <div
    className={`absolute transition-all duration-200 top-0 left-0 h-1 bg-green-500 ${progress < 40 && "bg-red-600"}`}
    style={{ width: `${progress}%` }}
  />
  {/* Right border progress */}
  <div
    className={`absolute transition-all duration-200 top-0 right-0 w-1 bg-green-500 ${progress < 40 && "bg-red-600"}`}
    style={{ height: `${progress}%` }}
  />
  {/* Bottom border progress */}
  <div
    className={`absolute transition-all duration-200 bottom-0 left-0 h-1 bg-green-500 ${progress < 40 && "bg-red-600"}`}
    style={{ width: `${progress}%` }}
  />
  {/* Left border progress */}
  <div
    className={`absolute transition-all duration-200 top-0 left-0 w-1 bg-green-500 ${progress < 40 && "bg-red-600"}`}
    style={{ height: `${progress}%` }}
  />
      <div className="p-4 text-center">
        <p className="text-gray-800 mb-4">
          Incoming file transfer from <span className="font-semibold">{sender}</span>
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onAccept}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReqPopUp;
