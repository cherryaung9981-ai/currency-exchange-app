import { useState } from 'react';
import { DollarSign, Coins, Calculator } from 'lucide-react';
import ExchangeRatesPage from './components/ExchangeRatesPage';
import GoldPricesPage from './components/GoldPricesPage';
import CalculatorPage from './components/CalculatorPage';
import AdBanner from './components/AdBanner';

type Tab = 'rates' | 'gold' | 'calculator';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('rates');

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 overflow-hidden pb-4">
        <AdBanner />

        <div className="h-full pt-2">
          {activeTab === 'rates' && <ExchangeRatesPage />}
          {activeTab === 'gold' && <GoldPricesPage />}
          {activeTab === 'calculator' && <CalculatorPage />}
        </div>
      </div>

      <nav className="bg-white border-t-2 border-sky-200 shadow-lg">
        <div className="flex justify-around items-center h-20">
          <button
            onClick={() => setActiveTab('rates')}
            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
              activeTab === 'rates'
                ? 'text-sky-600 bg-sky-50'
                : 'text-gray-500 hover:text-sky-500 hover:bg-gray-50'
            }`}
          >
            <DollarSign className="w-6 h-6" />
            <span className="text-xs font-medium">Exchange Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('gold')}
            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
              activeTab === 'gold'
                ? 'text-amber-600 bg-amber-50'
                : 'text-gray-500 hover:text-amber-500 hover:bg-gray-50'
            }`}
          >
            <Coins className="w-6 h-6" />
            <span className="text-xs font-medium">Gold</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
              activeTab === 'calculator'
                ? 'text-emerald-600 bg-emerald-50'
                : 'text-gray-500 hover:text-emerald-500 hover:bg-gray-50'
            }`}
          >
            <Calculator className="w-6 h-6" />
            <span className="text-xs font-medium">Calculate</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;
