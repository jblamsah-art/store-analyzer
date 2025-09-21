import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  List,
  BarChart2,
  Clipboard,
  Info,
  ExternalLink,
  Github,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'tailwindcss/tailwind.css';

// The main App component
function App() {
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState('');
  const [showExample, setShowExample] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  const handleAnalyze = () => {
    setAnalysisResult(null);
    setAnalysisError('');
    setCopyStatus('');

    if (!inputText.trim()) {
      setAnalysisError('Please paste your store data to analyze.');
      return;
    }

    try {
      const data = inputText
        .trim()
        .split('\n')
        .map((line) => {
          const parts = line.split('\t');
          if (parts.length < 3) {
            throw new Error('Invalid data format: each line must have at least 3 tab-separated values.');
          }
          return {
            date: parts[0],
            sales: parseFloat(parts[1].replace(/,/g, '')),
            cost: parseFloat(parts[2].replace(/,/g, '')),
          };
        });

      const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
      const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
      const profit = totalSales - totalCost;
      const profitMargin = (profit / totalSales) * 100;
      const dailySales = {};
      const monthlySales = {};
      const dailyProfit = {};
      const monthlyProfit = {};

      data.forEach((item) => {
        const date = item.date;
        const month = date.substring(0, 7);

        dailySales[date] = (dailySales[date] || 0) + item.sales;
        dailyProfit[date] = (dailyProfit[date] || 0) + (item.sales - item.cost);
        monthlySales[month] = (monthlySales[month] || 0) + item.sales;
        monthlyProfit[month] = (monthlyProfit[month] || 0) + (item.sales - item.cost);
      });

      const sortedDailySales = Object.entries(dailySales).sort();
      const sortedMonthlySales = Object.entries(monthlySales).sort();
      const sortedDailyProfit = Object.entries(dailyProfit).sort();
      const sortedMonthlyProfit = Object.entries(monthlyProfit).sort();

      const highestSellingDay = sortedDailySales.reduce(
        (max, [date, sales]) => (sales > max.sales ? { date, sales } : max),
        { date: '', sales: -Infinity }
      );
      const lowestSellingDay = sortedDailySales.reduce(
        (min, [date, sales]) => (sales < min.sales ? { date, sales } : min),
        { date: '', sales: Infinity }
      );
      const mostProfitableMonth = sortedMonthlyProfit.reduce(
        (max, [month, profit]) => (profit > max.profit ? { month, profit } : max),
        { month: '', profit: -Infinity }
      );
      const leastProfitableMonth = sortedMonthlyProfit.reduce(
        (min, [month, profit]) => (profit < min.profit ? { month, profit } : min),
        { month: '', profit: Infinity }
      );

      setAnalysisResult({
        totalSales,
        totalCost,
        profit,
        profitMargin,
        highestSellingDay,
        lowestSellingDay,
        mostProfitableMonth,
        leastProfitableMonth,
        dataLength: data.length,
      });
    } catch (error) {
      setAnalysisError(`Error: ${error.message}`);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      setCopyStatus('Data pasted successfully!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setAnalysisError('Failed to read from clipboard. Please paste manually.');
    }
  };

  const clearData = () => {
    setInputText('');
    setAnalysisResult(null);
    setAnalysisError('');
    setCopyStatus('');
  };

  const exampleData = `2023-01-01	1000	300
2023-01-01	1500	450
2023-01-02	800	200
2023-01-02	1200	350
2023-01-03	2000	600
2023-02-01	3000	900
2023-02-02	2500	750
2023-03-01	4000	1200
2023-03-02	3500	1050
2023-03-03	4500	1350`;

  const copyExample = () => {
    navigator.clipboard.writeText(exampleData).then(() => {
      setCopyStatus('Example data copied to clipboard!');
      setTimeout(() => setCopyStatus(''), 2000);
    });
  };

  const formatNumber = (num) => {
    if (num === -Infinity || num === Infinity) {
      return 'N/A';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <header className="w-full max-w-4xl text-center py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-400">
          Store Analyzer
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Paste your sales data to get instant insights.
        </p>
      </header>
      <main className="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-grow flex flex-col space-y-4">
            <textarea
              className="w-full h-48 md:h-64 p-4 text-gray-200 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
              placeholder="Paste your data here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
            {copyStatus && (
              <p className="text-green-400 text-center animate-fadeInOut">
                {copyStatus}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAnalyze}
                className="flex-1 min-w-[150px] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <BarChart2 size={20} />
                <span>Analyze</span>
              </button>
              <button
                onClick={handlePaste}
                className="flex-1 min-w-[150px] bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Clipboard size={20} />
                <span>Paste</span>
              </button>
              <button
                onClick={clearData}
                className="flex-1 min-w-[150px] bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 size={20} />
                <span>Clear</span>
              </button>
            </div>
            {analysisError && (
              <div className="bg-red-500/20 text-red-400 p-4 rounded-lg flex items-center space-x-2">
                <Info size={20} />
                <span>{analysisError}</span>
              </div>
            )}
            <div className="flex items-center mt-4">
              <button
                onClick={() => setShowExample(!showExample)}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-medium"
              >
                <span>Show Example Format</span>
                {showExample ? (
                  <X size={16} />
                ) : (
                  <List size={16} />
                )}
              </button>
            </div>
            {showExample && (
              <div className="bg-gray-700 p-4 rounded-lg mt-4">
                <p className="text-gray-400 mb-2">
                  Data should be tab-separated with three columns: Date, Sales,
                  and Cost.
                </p>
                <SyntaxHighlighter
                  language="text"
                  style={atomDark}
                  className="rounded-lg text-sm"
                >
                  {exampleData}
                </SyntaxHighlighter>
                <button
                  onClick={copyExample}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded-lg transition-colors"
                >
                  Copy Example
                </button>
              </div>
            )}
          </div>
        </div>
        {analysisResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold text-gray-300">Total Sales</h3>
              <p className="mt-2 text-3xl font-bold text-green-400">
                ${formatNumber(analysisResult.totalSales)}
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold text-gray-300">Total Cost</h3>
              <p className="mt-2 text-3xl font-bold text-red-400">
                ${formatNumber(analysisResult.totalCost)}
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold text-gray-300">Total Profit</h3>
              <p className="mt-2 text-3xl font-bold text-purple-400">
                ${formatNumber(analysisResult.profit)}
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold text-gray-300">Profit Margin</h3>
              <p className="mt-2 text-3xl font-bold text-yellow-400">
                {formatNumber(analysisResult.profitMargin)}%
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-inner md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-300">
                Key Insights
              </h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-600 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Best Sales Day</p>
                  <p className="text-xl font-bold text-green-300">
                    {analysisResult.highestSellingDay.date}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    ${formatNumber(analysisResult.highestSellingDay.sales)}
                  </p>
                </div>
                <div className="bg-gray-600 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Worst Sales Day</p>
                  <p className="text-xl font-bold text-red-300">
                    {analysisResult.lowestSellingDay.date}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    ${formatNumber(analysisResult.lowestSellingDay.sales)}
                  </p>
                </div>
                <div className="bg-gray-600 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Most Profitable Month</p>
                  <p className="text-xl font-bold text-green-300">
                    {analysisResult.mostProfitableMonth.month}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    ${formatNumber(analysisResult.mostProfitableMonth.profit)}
                  </p>
                </div>
                <div className="bg-gray-600 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Least Profitable Month
                  </p>
                  <p className="text-xl font-bold text-red-300">
                    {analysisResult.leastProfitableMonth.month}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    ${formatNumber(analysisResult.leastProfitableMonth.profit)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="w-full max-w-4xl text-center mt-12 py-4 text-gray-500 text-sm flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <p>&copy; {new Date().getFullYear()} Lamsah.com. All rights reserved.</p>
        <div className="flex space-x-4">
          <a
            href="https://github.com/jblamsah-art/store-analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors flex items-center space-x-1"
          >
            <Github size={16} />
            <span>Source Code</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;