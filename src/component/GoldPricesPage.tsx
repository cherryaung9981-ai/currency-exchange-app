import { useEffect, useState } from 'react';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { supabase, GoldPrice } from '../lib/supabase';

export default function GoldPricesPage() {
  const [prices, setPrices] = useState<GoldPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gold_prices')
      .select('*')
      .order('price_type', { ascending: true });

    if (error) {
      console.error('Error fetching gold prices:', error);
    } else if (data) {
      setPrices(data);
      if (data.length > 0) {
        const date = new Date(data[0].last_updated);
        setLastUpdated(date.toLocaleString());
      }
    }
    setLoading(false);
  };

  const getPriceLabel = (type: string) => {
    switch (type) {
      case 'world':
        return 'World Gold Price';
      case 'myanmar_16_pae':
        return 'Myanmar 16 Pae Yay';
      case 'myanmar_15_pae':
        return 'Myanmar 15 Pae Yay';
      default:
        return type;
    }
  };

  const getIcon = (type: string) => {
    if (type === 'world') {
      return '🌍';
    }
    return '🇲🇲';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white p-6 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gold Prices</h1>
            <p className="text-sm text-amber-50 mt-1">Current market rates</p>
          </div>
          <button
            onClick={fetchPrices}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {lastUpdated && (
          <p className="text-xs text-amber-100 mt-2">Last updated: {lastUpdated}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-white p-4">
        {loading && prices.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {prices.map((price) => (
              <div
                key={price.id}
                className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{getIcon(price.price_type)}</span>
                    <div>
                      <p className="font-bold text-amber-800 text-lg">
                        {getPriceLabel(price.price_type)}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {price.unit.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div className="mt-4 pt-4 border-t border-amber-200">
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-amber-700">
                      {price.price.toLocaleString()}
                    </p>
                    <p className="text-lg text-gray-600">{price.currency}</p>
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
