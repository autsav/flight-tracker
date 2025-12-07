import { Flight } from '@/types/flight';
import { AviationStackFlight } from '@/types/aviation-stack';

export function mapAviationStackFlightToFlight(apiFlight: AviationStackFlight): Flight {
    // Calculate duration if possible, otherwise default string
    // Aviation stack doesn't provide duration directly, we'd have to calc it from times
    // For now, we'll leave it as a placeholder or calculate simple difference if times exist

    const statusMap: Record<string, Flight['status']> = {
        scheduled: 'On Time',
        active: 'On Time',
        landed: 'Arrived',
        cancelled: 'Cancelled',
        incident: 'Delayed',
        diverted: 'Delayed',
    };

    return {
        id: `${apiFlight.flight.iata}-${apiFlight.flight_date}`,
        flightNumber: apiFlight.flight.iata || apiFlight.flight.number,
        airline: apiFlight.airline.name,
        departure: {
            airport: apiFlight.departure.airport,
            code: apiFlight.departure.iata,
            city: apiFlight.departure.timezone.split('/')[1]?.replace('_', ' ') || apiFlight.departure.timezone, // Approximate city from timezone
            time: apiFlight.departure.scheduled,
            timezone: apiFlight.departure.timezone,
        },
        arrival: {
            airport: apiFlight.arrival.airport,
            code: apiFlight.arrival.iata,
            city: apiFlight.arrival.timezone.split('/')[1]?.replace('_', ' ') || apiFlight.arrival.timezone,
            time: apiFlight.arrival.scheduled,
            timezone: apiFlight.arrival.timezone,
        },
        status: statusMap[apiFlight.flight_status] || 'On Time',
        duration: 'N/A', // Complex to calc accurately without libraries, leaving as N/A for now
    };
}
