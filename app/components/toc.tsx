'use client'

import React from 'react'

export const TableOfContents = ({ children }: { children: React.ReactNode }) => {
  return (
    <details className="toc-container group my-8 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
      <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/50">
        <span className="text-base font-semibold">Table of Contents</span>
        <span className="ml-auto transition-transform duration-200 group-open:rotate-180">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </summary>
      <div className="toc-content border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
        {children}
      </div>
    </details>
  )
}
