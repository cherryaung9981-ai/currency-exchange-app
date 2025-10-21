import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { supabase, ExchangeRate } from '../lib/supabase';

export default function ExchangeRatesPage() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('currency_code', { ascending: true });

    if (error) {
      console.error('Error fetching rates:', error);
    } else if (data) {
      setRates(data);
      if (data.length > 0) {
        const date = new Date(data[0].last_updated);
        setLastUpdated(date.toLocaleString());
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white p-6 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Exchange Rates</h1>
            <p className="text-sm text-blue-50 mt-1">1 Foreign Currency = MMK</p>
          </div>
          <button
            onClick={fetchRates}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {lastUpdated && (
          <p className="text-xs text-blue-100 mt-2">Last updated: {lastUpdated}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-white p-4">
        {loading && rates.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {rates.map((rate) => (
              <div
                key={rate.id}
                className="bg-white border border-sky-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{rate.flag_emoji}</span>
                    <div>
                      <p className="font-semibold text-sky-700 text-lg">
                        {rate.currency_code}
                      </p>
                      <p className="text-sm text-gray-600">{rate.currency_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-sky-600">
                      {rate.rate_to_mmk.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">MMK</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
