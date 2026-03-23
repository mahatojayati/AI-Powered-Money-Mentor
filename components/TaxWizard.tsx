'use client';
import { useState } from 'react';
import { getGeminiClient } from '@/lib/gemini';
import Markdown from 'react-markdown';
import { Loader2 } from 'lucide-react';

export default function TaxWizard() {
  const [salary, setSalary] = useState('');
  const [hra, setHra] = useState('');
  const [pf, setPf] = useState('');
  const [otherDeductions, setOtherDeductions] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const ai = getGeminiClient();
      const prompt = `Act as an expert Indian Chartered Accountant. I need help optimizing my taxes.
Here is my salary structure:
- Annual Salary (CTC): ₹${salary}
- HRA Received: ₹${hra}
- Employee PF Contribution: ₹${pf}
- Other Deductions (80C, 80D, etc.): ₹${otherDeductions}

Please provide:
1. A comparison between the Old Tax Regime and New Tax Regime for my specific numbers.
2. Identify any deductions I might be missing.
3. Suggest tax-saving investments ranked by risk profile and liquidity needs.

Format the response in Markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setResult(response.text || 'No response generated.');
    } catch (error) {
      console.error(error);
      setResult('An error occurred while generating the tax plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Tax Wizard</h2>
      <p className="text-gray-600">Input your salary structure to model old vs. new tax regime and find missing deductions.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Annual Salary (CTC) (₹)</label>
          <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 1500000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">HRA Received (₹)</label>
          <input type="number" value={hra} onChange={(e) => setHra(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 200000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee PF Contribution (₹)</label>
          <input type="number" value={pf} onChange={(e) => setPf(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 50000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Other Deductions (80C, 80D, etc.) (₹)</label>
          <input type="number" value={otherDeductions} onChange={(e) => setOtherDeductions(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 150000" />
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading || !salary} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
        Analyze Taxes
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
