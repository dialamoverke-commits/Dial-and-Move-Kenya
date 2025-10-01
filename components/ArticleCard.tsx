
import React, { useState, useCallback } from 'react';
import type { GeneratedArticle } from '../types';
import { ContentType } from '../types';
import { ScoreGauge } from './ScoreGauge';

interface ArticleCardProps {
  article: GeneratedArticle;
}

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [textToCopy]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-gray-300 p-2 rounded-md transition duration-200"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.GBP);

  const renderContent = () => {
    switch (activeTab) {
      case ContentType.Website:
        return (
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-cyan-300">{article.websiteArticle.title}</h4>
            <p className="whitespace-pre-wrap text-gray-300">{article.websiteArticle.body}</p>
            <CopyButton textToCopy={`Title: ${article.websiteArticle.title}\n\n${article.websiteArticle.body}`} />
          </div>
        );
      case ContentType.Social:
        return (
          <div>
            <p className="whitespace-pre-wrap text-gray-300">{article.socialMediaPost}</p>
            <CopyButton textToCopy={article.socialMediaPost} />
          </div>
        );
      case ContentType.GBP:
      default:
        return (
          <div>
            <p className="whitespace-pre-wrap text-gray-300">{article.googleBusinessProfile}</p>
            <CopyButton textToCopy={article.googleBusinessProfile} />
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-800/60 rounded-xl shadow-lg overflow-hidden border border-gray-700 backdrop-blur-sm transition-all duration-300 hover:shadow-cyan-900/50 hover:border-cyan-700">
      <div className="p-6 flex flex-col md:flex-row items-start gap-6 border-b border-gray-700">
        <div className="flex-shrink-0">
          <ScoreGauge score={article.overallScore} />
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white mb-2">{article.theme}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
            <span>Virality: <strong className="text-cyan-400">{article.scores.virality}</strong></span>
            <span>Localization: <strong className="text-cyan-400">{article.scores.localization}</strong></span>
            <span>SEO: <strong className="text-cyan-400">{article.scores.seo}</strong></span>
            <span>CTA: <strong className="text-cyan-400">{article.scores.ctaClarity}</strong></span>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex border-b border-gray-700">
          {(Object.values(ContentType) as ContentType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-2 text-sm font-medium transition duration-200 focus:outline-none ${
                activeTab === tab 
                ? 'bg-cyan-800/50 text-cyan-300 border-b-2 border-cyan-400' 
                : 'text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="p-6 bg-gray-900/50 min-h-[200px] relative">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
