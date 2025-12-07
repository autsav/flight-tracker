import { Flight } from '@/types/flight';
import { Plane, Clock, MapPin, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface FlightResultsProps {
    flights: Flight[];
}

export function FlightResults({ flights }: FlightResultsProps) {
    if (flights.length === 0) {
        return null;
    }

    return (
        <div className="w-full max-w-2xl space-y-4 mt-8">
            {flights.map((flight) => (
                <div
                    key={flight.id}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl hover:bg-white/15 transition-all duration-300"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-full">
                                <Plane className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{flight.airline}</h3>
                                <p className="text-sm text-gray-300">{flight.flightNumber}</p>
                            </div>
                        </div>
                        <div className={`px-4 py-1 rounded-full text-sm font-medium ${flight.status === 'On Time' ? 'bg-green-500/20 text-green-400' :
                                flight.status === 'Delayed' ? 'bg-yellow-500/20 text-yellow-400' :
                                    flight.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                                        'bg-gray-500/20 text-gray-400'
                            }`}>
                            {flight.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        {/* Departure */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>Departure</span>
                            </div>
                            <div className="text-2xl font-bold">{flight.departure.code}</div>
                            <div className="text-lg">{flight.departure.city}</div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Clock className="w-4 h-4" />
                                {format(parseISO(flight.departure.time), 'HH:mm')}
                            </div>
                            <div className="text-xs text-gray-500">{flight.departure.timezone}</div>
                        </div>

                        {/* Duration */}
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="text-sm text-gray-400">{flight.duration}</div>
                            <div className="w-full h-px bg-gray-600 relative">
                                <Plane className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="space-y-2 text-right md:text-left">
                            <div className="flex items-center gap-2 text-gray-400 text-sm justify-end md:justify-start">
                                <MapPin className="w-4 h-4" />
                                <span>Arrival</span>
                            </div>
                            <div className="text-2xl font-bold">{flight.arrival.code}</div>
                            <div className="text-lg">{flight.arrival.city}</div>
                            <div className="flex items-center gap-2 text-sm text-gray-300 justify-end md:justify-start">
                                <Clock className="w-4 h-4" />
                                {format(parseISO(flight.arrival.time), 'HH:mm')}
                            </div>
                            <div className="text-xs text-gray-500">{flight.arrival.timezone}</div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {format(parseISO(flight.departure.time), 'MMM d, yyyy')}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
