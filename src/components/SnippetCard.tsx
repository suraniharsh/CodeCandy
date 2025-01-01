import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiTag } from 'react-icons/fi';
import type { Snippet } from '../services/snippetService';

interface SnippetCardProps {
  snippet: Snippet;
  className?: string;
}

export function SnippetCard({ snippet, className = '' }: SnippetCardProps) {
  return (
    <div
      className={`group bg-dark-700 rounded-lg border border-dark-600 hover:border-primary-500 transition-smooth hover:shadow-lg overflow-hidden ${className}`}
    >
      <Link to={`/snippet/${snippet.id}`} className="block p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-dark-100 group-hover:text-primary-400 transition-smooth line-clamp-1 flex-1 mr-3">
            {snippet.title}
          </h3>
          <span className="flex-shrink-0 text-xs font-medium text-dark-300 bg-dark-600/50 px-2.5 py-1 rounded-full">
            {snippet.language}
          </span>
        </div>
        <p className="text-dark-300 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {snippet.description}
        </p>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center text-dark-400">
            <FiClock className="mr-1.5 h-4 w-4" />
            <span className="text-xs">
              {new Date(snippet.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {snippet.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 font-medium whitespace-nowrap"
              >
                <FiTag className="mr-1 h-3 w-3 flex-shrink-0" />
                {tag}
              </span>
            ))}
            {snippet.tags.length > 2 && (
              <span className="text-xs text-dark-400 whitespace-nowrap">
                +{snippet.tags.length - 2} more
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
} 