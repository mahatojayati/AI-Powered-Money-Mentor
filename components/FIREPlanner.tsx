'use client';
import { useState } from 'react';
import { getGeminiClient } from '@/lib/gemini';
import Markdown from 'react-markdown';
import { Loader2 } from 'lucide-react';

export default function FIREPlanner() {
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [investments, setInvestments] = useState('');
  const [goals, setGoals] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const ai = getGeminiClient();
      const prompt = `Act as an expert Indian financial advisor. I want to plan for Financial Independence, Retire Early (FIRE).
Here are my details:
- Age: ${age}
- Monthly Income: ₹${income}
- Monthly Expenses: ₹${expenses}
- Existing Investments: ₹${investments}
- Life Goals: ${goals}

Please provide a complete, month-by-month financial roadmap including:
1. SIP amounts per goal
2. Asset allocation shifts
3. Insurance gaps
4. Tax-saving moves
5. Emergency fund targets

Format the response in Markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setResult(response.text || 'No response generated.');
    } catch (error) {
      console.error(error);
      setResult('An error occurred while generating the plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">FIRE Path Planner</h2>
      <p className="text-gray-600">Enter your details to generate a personalized Financial Independence, Retire Early (FIRE) roadmap.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 30" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Income (₹)</label>
          <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 100000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Expenses (₹)</label>
          <input type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 40000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Existing Investments (₹)</label>
          <input type="number" value={investments} onChange={(e) => setInvestments(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 500000" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Life Goals</label>
          <textarea value={goals} onChange={(e) => setGoals(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" rows={3} placeholder="e.g. Buy a house in 5 years, child's education in 15 years" />
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading || !age || !income || !expenses} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
        Generate FIRE Plan
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
