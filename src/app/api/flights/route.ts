import { NextResponse } from 'next/server';
import { OpenSkyResponse, OpenSkyStateVector } from '@/types/opensky';
import { mapOpenSkyStateToFlight } from '@/lib/flight-mapper';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('flightNumber')?.toUpperCase().trim();

    if (!query) {
        return NextResponse.json([]);
    }

    try {
        // OpenSky /states/all returns ALL live flights (heavy payload).
        // Ideally we would filter by bounding box, but for global search we fetch all.
        // Note: Anonymous users have lower rate limits.
        const response = await fetch('https://opensky-network.org/api/states/all', {
            next: { revalidate: 10 } // Cache for 10 seconds
        });

        if (!response.ok) {
            throw new Error(`OpenSky API Error: ${response.statusText}`);
        }

        const data: OpenSkyResponse = await response.json();

        // Filter for the requested flight number (callsign)
        // OpenSky callsigns often have trailing spaces or airline prefixes
        const matchedState = data.states?.find((state) => {
            const callsign = (state[1] as string || '').trim();
            // Loose matching: check if callsign includes query or query includes callsign
            return callsign === query || callsign.includes(query) || query.includes(callsign);
        });

        if (!matchedState) {
            return NextResponse.json([]);
        }

        // Map the raw state vector to our typed object
        const stateVector: OpenSkyStateVector = {
            icao24: matchedState[0] as string,
            callsign: matchedState[1] as string,
            origin_country: matchedState[2] as string,
            time_position: matchedState[3] as number,
            last_contact: matchedState[4] as number,
            longitude: matchedState[5] as number,
            latitude: matchedState[6] as number,
            baro_altitude: matchedState[7] as number,
            on_ground: matchedState[8] as boolean,
            velocity: matchedState[9] as number,
            true_track: matchedState[10] as number,
            vertical_rate: matchedState[11] as number,
            sensors: matchedState[12] as unknown as number[],
            geo_altitude: matchedState[13] as number,
            squawk: matchedState[14] as string,
            spi: matchedState[15] as boolean,
            position_source: matchedState[16] as number,
        };

        // Step 2: Fetch Route Info (Origin/Destination)
        // We look for flights by this aircraft in the last 48 hours to find the current segment
        let routeInfo = undefined;
        try {
            const now = Math.floor(Date.now() / 1000);
            const begin = now - (48 * 60 * 60); // 48 hours ago
            const end = now + 7200;    // 2 hours in future

            const routeResponse = await fetch(
                `https://opensky-network.org/api/flights/aircraft?icao24=${stateVector.icao24}&begin=${begin}&end=${end}`
            );

            if (routeResponse.ok) {
                const routeData = await routeResponse.json();
                // Get the most recent flight segment
                if (Array.isArray(routeData) && routeData.length > 0) {
                    routeData.sort((a: any, b: any) => b.firstSeen - a.firstSeen);
                    routeInfo = routeData[0];
                }
            } else {
                console.warn(`Route fetch failed: ${routeResponse.status} ${routeResponse.statusText}`);
            }
        } catch (err) {
            console.warn('Failed to fetch route info:', err);
            // Continue without route info
        }

        const flight = mapOpenSkyStateToFlight(stateVector, routeInfo);
        return NextResponse.json([flight]);

    } catch (error) {
        console.error('Error fetching flights from OpenSky:', error);
        return NextResponse.json({ error: 'Failed to fetch flight data' }, { status: 500 });
    }
}
