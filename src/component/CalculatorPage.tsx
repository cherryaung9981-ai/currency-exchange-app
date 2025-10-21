import { useEffect, useState } from 'react';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import { supabase, ExchangeRate } from '../lib/supabase';

export default function CalculatorPage() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('MMK');
  const [fromAmount, setFromAmount] = useState('1');
  const [toAmount, setToAmount] = useState('');

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    if (rates.length > 0) {
      calculateConversion();
    }
  }, [fromAmount, fromCurrency, toCurrency, rates]);

  const fetchRates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('currency_code', { ascending: true });

    if (error) {
      console.error('Error fetching rates:', error);
    } else if (data) {
      const mmkRate: ExchangeRate = {
        id: 'mmk',
        currency_code: 'MMK',
        currency_name: 'Myanmar Kyat',
        rate_to_mmk: 1,
        flag_emoji: '🇲🇲',
        last_updated: new Date().toISOString(),
      };
      setRates([mmkRate, ...data]);
    }
    setLoading(false);
  };

  const calculateConversion = () => {
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) {
      setToAmount('');
      return;
    }

    const fromRate = rates.find((r) => r.currency_code === fromCurrency);
    const toRate = rates.find((r) => r.currency_code === toCurrency);

    if (!fromRate || !toRate) return;

    const amountInMMK = amount * fromRate.rate_to_mmk;
    const convertedAmount = amountInMMK / toRate.rate_to_mmk;

    setToAmount(convertedAmount.toFixed(2));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount || '1');
  };

  const handleFromAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleToAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setToAmount(value);
      const amount = parseFloat(value);
      if (!isNaN(amount) && amount > 0) {
        const fromRate = rates.find((r) => r.currency_code === fromCurrency);
        const toRate = rates.find((r) => r.currency_code === toCurrency);
        if (fromRate && toRate) {
          const amountInMMK = amount * toRate.rate_to_mmk;
          const convertedAmount = amountInMMK / fromRate.rate_to_mmk;
          setFromAmount(convertedAmount.toFixed(2));
        }
      }
    }
  };

  const getFlag = (code: string) => {
    const currency = rates.find((r) => r.currency_code === code);
    return currency?.flag_emoji || '🏳️';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white p-6 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Currency Calculator</h1>
            <p className="text-sm text-emerald-50 mt-1">Convert between currencies</p>
          </div>
          <button
            onClick={fetchRates}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white p-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 shadow-md border border-sky-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="w-full px-4 py-3 text-2xl font-semibold text-sky-700 bg-white rounded-lg border-2 border-sky-300 focus:border-sky-500 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="w-40">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full h-full px-3 py-3 text-lg font-medium text-sky-700 bg-white rounded-lg border-2 border-sky-300 focus:border-sky-500 focus:outline-none appearance-none cursor-pointer"
                  >
                    {rates.map((rate) => (
                      <option key={rate.id} value={rate.currency_code}>
                        {getFlag(rate.currency_code)} {rate.currency_code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={swapCurrencies}
                className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
              >
                <ArrowLeftRight className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 shadow-md border border-emerald-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <div className="flex space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={toAmount}
                    onChange={(e) => handleToAmountChange(e.target.value)}
                    className="w-full px-4 py-3 text-2xl font-semibold text-emerald-700 bg-white rounded-lg border-2 border-emerald-300 focus:border-emerald-500 focus:outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="w-40">
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full h-full px-3 py-3 text-lg font-medium text-emerald-700 bg-white rounded-lg border-2 border-emerald-300 focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer"
                  >
                    {rates.map((rate) => (
                      <option key={rate.id} value={rate.currency_code}>
                        {getFlag(rate.currency_code)} {rate.currency_code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {toAmount && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 text-center border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Conversion Result</p>
                <p className="text-2xl font-bold text-gray-800">
                  {fromAmount} {fromCurrency} = {toAmount} {toCurrency}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
