'use client';
import { useState } from 'react';
import { getGeminiClient } from '@/lib/gemini';
import Markdown from 'react-markdown';
import { Loader2 } from 'lucide-react';

export default function LifeEventAdvisor() {
  const [event, setEvent] = useState('bonus');
  const [amount, setAmount] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const ai = getGeminiClient();
      const prompt = `Act as an expert Indian financial advisor. I have a specific life event that requires financial decisions.
Event: ${event}
Amount involved (if any): ₹${amount}
Additional Context (tax bracket, portfolio, risk profile, goals): ${context}

Please provide customized financial advice for this specific life event, including tax implications, investment strategies, and potential pitfalls to avoid.

Format the response in Markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setResult(response.text || 'No response generated.');
    } catch (error) {
      console.error(error);
      setResult('An error occurred while generating the advice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Life Event Financial Advisor</h2>
      <p className="text-gray-600">Get customized advice for specific life-event-triggered financial decisions.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Life Event</label>
          <select value={event} onChange={(e) => setEvent(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white">
            <option value="bonus">Received a Bonus</option>
            <option value="inheritance">Inheritance</option>
            <option value="marriage">Marriage</option>
            <option value="new_baby">New Baby</option>
            <option value="job_loss">Job Loss</option>
            <option value="buying_house">Buying a House</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount Involved (₹) (Optional)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 500000" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Additional Context (Tax bracket, risk profile, goals)</label>
          <textarea value={context} onChange={(e) => setContext(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" rows={3} placeholder="e.g. I am in the 30% tax bracket, moderate risk taker, looking to buy a car in 2 years." />
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
        Get Advice
      </button>

      {result && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow border border-gray-200 prose max-w-none">
          <div className="markdown-body">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}
