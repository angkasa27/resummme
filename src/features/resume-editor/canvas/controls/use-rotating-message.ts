"use client";

import { useEffect, useState } from "react";

/**
 * Cycle through a list of strings on a timer. Picks the next message randomly
 * from the entries other than the current one so it visibly changes.
 */
export function useRotatingMessage(
  messages: readonly string[],
  intervalMs: number,
) {
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function schedule() {
      timer = setTimeout(() => {
        setMessage((current) => {
          const remaining = messages.filter((entry) => entry !== current);
          const pool = remaining.length > 0 ? remaining : messages;
          return pool[Math.floor(Math.random() * pool.length)];
        });
        schedule();
      }, intervalMs);
    }
    schedule();
    return () => clearTimeout(timer);
  }, [messages, intervalMs]);

  return message;
}
