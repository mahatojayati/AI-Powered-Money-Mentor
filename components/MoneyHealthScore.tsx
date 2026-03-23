'use client';
import { useState } from 'react';
import { getGeminiClient } from '@/lib/gemini';
import Markdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function MoneyHealthScore() {
  const [emergencyFund, setEmergencyFund] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [insuranceCover, setInsuranceCover] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [totalDebt, setTotalDebt] = useState('');
  const [monthlyEmi, setMonthlyEmi] = useState('');
  const [investments, setInvestments] = useState('');
  const [result, setResult] = useState('');
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const ai = getGeminiClient();
      const prompt = `Act as an expert Indian financial advisor. I want to calculate my Money Health Score.
Here are my details:
- Emergency Fund: ₹${emergencyFund}
- Monthly Expenses: ₹${monthlyExpenses}
- Life Insurance Cover: ₹${insuranceCover}
- Annual Income: ₹${annualIncome}
- Total Debt: ₹${totalDebt}
- Monthly EMI: ₹${monthlyEmi}
- Total Investments: ₹${investments}

Please evaluate my financial wellness across 6 dimensions:
1. Emergency Preparedness
2. Insurance Coverage
3. Investment Diversification
4. Debt Health
5. Tax Efficiency
6. Retirement Readiness

Provide a score out of 100 for each dimension, and an overall score.
Format your response as a JSON object with the following structure:
{
  "overallScore": 85,
  "dimensions": [
    { "name": "Emergency Preparedness", "score": 90 },
    { "name": "Insurance Coverage", "score": 70 },
    { "name": "Investment Diversification", "score": 80 },
    { "name": "Debt Health", "score": 95 },
    { "name": "Tax Efficiency", "score": 60 },
    { "name": "Retirement Readiness", "score": 75 }
  ],
  "analysis": "Detailed markdown text explaining the scores and providing actionable advice."
}
Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const data = JSON.parse(response.text || '{}');
      setScoreData(data);
      setResult(data.analysis || '');
    } catch (error) {
      console.error(error);
      setResult('An error occurred while calculating your score.');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Money Health Score</h2>
      <p className="text-gray-600">Take a 5-minute assessment to get your comprehensive financial wellness score.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Emergency Fund (₹)</label>
          <input type="number" value={emergencyFund} onChange={(e) => setEmergencyFund(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 200000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Expenses (₹)</label>
          <input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 50000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Life Insurance Cover (₹)</label>
          <input type="number" value={insuranceCover} onChange={(e) => setInsuranceCover(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 10000000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Annual Income (₹)</label>
          <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 1500000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Debt (₹)</label>
          <input type="number" value={totalDebt} onChange={(e) => setTotalDebt(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 5000000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly EMI (₹)</label>
          <input type="number" value={monthlyEmi} onChange={(e) => setMonthlyEmi(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 40000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Investments (₹)</label>
          <input type="number" value={investments} onChange={(e) => setInvestments(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" placeholder="e.g. 1000000" />
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
        Calculate Score
      </button>

      {scoreData && (
        <div className="mt-8 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 text-center">
            <h3 className="text-lg font-medium text-gray-900">Overall Money Health Score</h3>
            <div className="mt-4 text-6xl font-extrabold text-indigo-600">{scoreData.overallScore}/100</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Score Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreData.dimensions}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="score"
                  >
                    {scoreData.dimensions.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 prose max-w-none">
            <div className="markdown-body">
              <Markdown>{result}</Markdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
