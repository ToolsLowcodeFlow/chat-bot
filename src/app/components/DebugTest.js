// components/DebugTest.js - Use this component to test your API
"use client";

import { useState } from 'react';

export default function DebugTest() {
  const [testMessage, setTestMessage] = useState('Is BMW Available?');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testMindStudioAPI = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/chat/mindstudio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_prompt: testMessage
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setError(`Error ${res.status}: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">MindStudio API Debug Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Test Message:
          </label>
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter test message"
          />
        </div>

        <button
          onClick={testMindStudioAPI}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </button>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <h3 className="font-bold">Error:</h3>
            <pre className="whitespace-pre-wrap text-sm">{error}</pre>
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <h3 className="font-bold">Success Response:</h3>
            <pre className="whitespace-pre-wrap text-sm">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}