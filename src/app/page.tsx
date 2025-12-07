'use client';

import { useState } from 'react';
import { FlightSearch } from '@/components/FlightSearch';
import { FlightResults } from '@/components/FlightResults';
import { Flight } from '@/types/flight';

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (results: Flight[]) => {
    setFlights(results);
    setHasSearched(true);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
            Flight Tracker
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto">
            Track your flights in real-time with our premium flight lookup service.
          </p>
        </div>

        <FlightSearch onSearch={handleSearch} />

        <div className="w-full flex justify-center">
          {hasSearched && flights.length === 0 ? (
            <div className="text-gray-500 mt-8">No flights found. Try searching for &quot;AA123&quot; or &quot;BA456&quot;.</div>
          ) : (
            <FlightResults flights={flights} />
          )}
        </div>
      </div>
    </main>
  );
}
