'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Flight } from '@/types/flight';

interface FlightSearchProps {
    onSearch: (flights: Flight[]) => void;
}

export function FlightSearch({ onSearch }: FlightSearchProps) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/flights?flightNumber=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                onSearch(data);
            } else {
                console.error('Unexpected API response:', data);
                onSearch([]);
            }
        } catch (error) {
            console.error('Error fetching flights:', error);
            onSearch([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-md relative">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-gray-900 rounded-xl leading-none">
                    <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter flight number (e.g., AA123)"
                        className="w-full bg-transparent text-white placeholder-gray-400 py-4 pl-12 pr-12 rounded-xl focus:outline-none focus:ring-0"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                            <span className="text-sm font-medium text-white px-2">Search</span>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
