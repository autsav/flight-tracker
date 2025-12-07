import { NextResponse } from 'next/server';
import { AviationStackResponse } from '@/types/aviation-stack';
import { mapAviationStackFlightToFlight } from '@/lib/flight-mapper';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('flightNumber');
    const apiKey = process.env.AVIATION_STACK_API_KEY;

    if (!query) {
        return NextResponse.json([]);
    }

    if (!apiKey) {
        console.error('AVIATION_STACK_API_KEY is not defined');
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const response = await fetch(
            `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${query}`
        );

        const data: AviationStackResponse | { error: any } = await response.json();

        if ('error' in data) {
            console.error('Aviation Stack API Error:', data.error);
            // Return empty list or specific error depending on needs
            // For now, returning empty list to avoid breaking UI
            return NextResponse.json([]);
        }

        const flights = data.data.map(mapAviationStackFlightToFlight);
        return NextResponse.json(flights);

    } catch (error) {
        console.error('Error fetching flights:', error);
        return NextResponse.json({ error: 'Failed to fetch flight data' }, { status: 500 });
    }
}
