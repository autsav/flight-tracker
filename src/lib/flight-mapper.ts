import { Flight } from '@/types/flight';
import { AviationStackFlight } from '@/types/aviation-stack';
import { OpenSkyStateVector, OpenSkyFlight } from '@/types/opensky';

export function mapAviationStackFlightToFlight(apiFlight: AviationStackFlight): Flight {
    // Calculate duration if possible, otherwise default string
    const duration = 'Unknown'; // Simplified for now

    const statusMap: Record<string, Flight['status']> = {
        active: 'In Air',
        landed: 'Arrived',
        scheduled: 'On Time',
        cancelled: 'Cancelled',
        incident: 'Delayed',
        diverted: 'Delayed',
    };

    return {
        id: apiFlight.flight.iata || apiFlight.flight.number,
        flightNumber: apiFlight.flight.iata,
        airline: apiFlight.airline.name,
        departure: {
            airport: apiFlight.departure.airport,
            code: apiFlight.departure.iata,
            city: 'Unknown', // AviationStack free tier might not give city easily in this structure
            time: apiFlight.departure.scheduled,
            timezone: apiFlight.departure.timezone,
        },
        arrival: {
            airport: apiFlight.arrival.airport,
            code: apiFlight.arrival.iata,
            city: 'Unknown',
            time: apiFlight.arrival.scheduled,
            timezone: apiFlight.arrival.timezone,
        },
        status: statusMap[apiFlight.flight_status] || 'On Time',
        duration: 'Unknown',
    };
}

export function mapOpenSkyStateToFlight(state: OpenSkyStateVector, route?: OpenSkyFlight): Flight {
    const now = new Date().toISOString();

    return {
        id: state.icao24,
        flightNumber: state.callsign?.trim() || 'Unknown',
        airline: 'Unknown', // OpenSky doesn't provide airline info directly
        status: state.on_ground ? 'On Ground' : 'In Air',
        departure: {
            airport: route?.estDepartureAirport || 'Unknown Origin',
            code: route?.estDepartureAirport || 'N/A',
            city: state.origin_country,
            time: route?.firstSeen ? new Date(route.firstSeen * 1000).toISOString() : now,
            timezone: 'UTC'
        },
        arrival: {
            airport: route?.estArrivalAirport || 'Unknown Destination',
            code: route?.estArrivalAirport || 'N/A',
            city: 'Unknown',
            time: route?.lastSeen ? new Date(route.lastSeen * 1000).toISOString() : now,
            timezone: 'UTC'
        },
        duration: 'N/A',
        altitude: state.baro_altitude || 0,
        speed: state.velocity || 0,
        heading: state.true_track || 0
    };
}
