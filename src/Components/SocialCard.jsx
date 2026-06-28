"use client";
import { useState } from "react";
import Link from "next/link";
import "./socialCard.css";

export default function SocialCard() {
  const [label, setLabel] = useState("Socials");

  return (
    <div className="card">
      <div className="background"></div>

      {/* Dynamic title */}
      <div className="logo">{label}</div>

      {/* GitHub */}
      <Link href="https://github.com/bhargav-developer" target="_blank">
        <div
          className="box box1"
          onMouseEnter={() => setLabel("GitHub")}
          onMouseLeave={() => setLabel("Socials")}
        >
          <span className="icon">
            <svg
              viewBox="0 0 24 24"
              className="svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.086 3.292 9.386 7.868 10.91.575.11.785-.243.785-.54 0-.267-.01-1.144-.016-2.074-3.2.695-3.878-1.365-3.878-1.365-.523-1.33-1.278-1.685-1.278-1.685-1.044-.714.08-.699.08-.699 1.155.081 1.763 1.186 1.763 1.186 1.028 1.762 2.697 1.253 3.356.958.104-.745.402-1.254.732-1.542-2.554-.29-5.238-1.278-5.238-5.688 0-1.257.449-2.285 1.184-3.09-.119-.289-.513-1.454.113-3.03 0 0 .966-.31 3.166 1.18a10.97 10.97 0 0 1 2.884-.388c.977.005 1.963.133 2.884.388 2.2-1.49 3.164-1.18 3.164-1.18.628 1.576.234 2.741.115 3.03.737.805 1.182 1.833 1.182 3.09 0 4.422-2.69 5.395-5.254 5.679.414.356.782 1.066.782 2.15 0 1.553-.015 2.805-.015 3.187 0 .3.208.656.791.538C20.21 21.38 23.5 17.082 23.5 12 23.5 5.648 18.352.5 12 .5Z" />
            </svg>
          </span>
        </div>
      </Link>

      {/* LinkedIn */}
      <Link href="https://www.linkedin.com/in/bhargav-chakravarthy-b919b6240/" target="_blank">
        <div
          className="box box2"
          onMouseEnter={() => setLabel("Linked-In")}
          onMouseLeave={() => setLabel("Socials")}
        >
          <span className="icon">
            <svg
              viewBox="0 0 24 24"
              className="svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.98 3.5C4.98 5 3.91 6 2.5 6S0 5 0 3.5 1.09 1 2.5 1 4.98 2 4.98 3.5zM.5 8h4V24h-4V8zM8.5 8h3.8v2.2h.05c.53-1 1.83-2.2 3.75-2.2 4 0 4.7 2.6 4.7 6V24h-4v-8c0-1.9 0-4.3-2.6-4.3-2.6 0-3 2-3 4.1V24h-4V8z" />
            </svg>
          </span>
        </div>
      </Link>

      {/* LeetCode */}
      <Link href="https://leetcode.com/u/bhargav-leetcode/" target="_blank">
        <div
          className="box box3"
          onMouseEnter={() => setLabel("Leet-Code")}
          onMouseLeave={() => setLabel("Socials")}
        >
          <span className="icon">
            <svg
              viewBox="0 0 24 24"
              className="svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.084 11.014l-6.226-6.223a1.356 1.356 0 010-1.92l.41-.41a1.356 1.356 0 011.92 0l7.4 7.4a1.356 1.356 0 010 1.92l-7.4 7.4a1.356 1.356 0 01-1.92 0l-.41-.41a1.356 1.356 0 010-1.92l6.226-6.222zm-8.88 8.609a6.789 6.789 0 010-9.606L12.8 5.49a1.39 1.39 0 000-1.962l-.42-.42a1.39 1.39 0 00-1.962 0L4.644 8.885a10.171 10.171 0 000 14.389l5.775 5.775a1.39 1.39 0 001.962 0l.42-.42a1.39 1.39 0 000-1.962l-3.597-3.597z" />
            </svg>
          </span>
        </div>
      </Link>

      {/* small expanding dot */}
      <div className="box box4"></div>
    </div>
  );
}
