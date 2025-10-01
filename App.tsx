
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ArticleCard } from './components/ArticleCard';
import { Loader } from './components/Loader';
import { generateContent } from './services/geminiService';
import type { GeneratedArticle } from './types';

const App: React.FC = () => {
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>('Moving within Nairobi');

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setArticles([]);
    try {
      const generatedArticles = await generateContent(topic);
      setArticles(generatedArticles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-2xl p-6 shadow-2xl border border-gray-700 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-center text-cyan-400 mb-2">Generate Your Viral Content</h2>
          <p className="text-center text-gray-400 mb-6">Enter a topic or theme to generate 10 unique, localized articles for Dial and Move Kenya.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Office Relocation"
              className="flex-grow bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-cyan-900/50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader/>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </svg>
                  Generate Articles
                </>
              )}
            </button>
          </div>
        </div>
        
        {error && <div className="text-center text-red-400 mt-6 bg-red-900/50 p-4 rounded-lg">{error}</div>}

        <div className="mt-12">
          {isLoading && articles.length === 0 && (
              <div className="text-center p-8">
                  <p className="text-lg text-gray-400">AI is warming up... crafting amazing content for you!</p>
              </div>
          )}
          {articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
          {!isLoading && articles.length === 0 && !error && (
            <div className="text-center mt-16 text-gray-500">
                <p className="text-xl">Your generated articles will appear here.</p>
                <p>Click "Generate Articles" to start.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
