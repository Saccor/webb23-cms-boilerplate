'use client';

import { useState, useEffect } from 'react';

export default function TestStoryblokPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/test-storyblok');
        if (!response.ok) {
          throw new Error('Failed to fetch Storyblok data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading Storyblok data...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Storyblok Connection Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Connection Info</h2>
        <p><strong>Status:</strong> {data.success ? 'Connected' : 'Failed'}</p>
        <p><strong>Environment:</strong> {data.environment}</p>
        <p><strong>Token Type:</strong> {data.tokenType}</p>
        <p><strong>Space ID:</strong> {data.spaceId}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Pages ({data.pageCount})</h2>
        {data.pages && data.pages.length > 0 ? (
          <ul className="space-y-2">
            {data.pages.map((page) => (
              <li key={page.id} className="p-3 bg-white shadow rounded">
                <p><strong>Name:</strong> {page.name}</p>
                <p><strong>Slug:</strong> {page.slug}</p>
                <p><strong>ID:</strong> {page.id}</p>
                <p><strong>Content Type:</strong> {page.content_type}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pages found.</p>
        )}
      </div>
    </div>
  );
} 