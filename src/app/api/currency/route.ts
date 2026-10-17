import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const clientIp = request.headers.get('x-nf-client-connection-ip') || '102.89.23.1';
    const geoRes = await fetch(http://ip-api.com/json/);
    const geoData = await geoRes.json();
    
    const countryCode = geoData.countryCode || 'NG';
    
    const currencyMap: Record<string, { code: string; symbol: string; rateToUSD: number }> = {
      NG: { code: 'NGN', symbol: '₦', rateToUSD: 1550 },
      KE: { code: 'KES', symbol: 'KSh', rateToUSD: 129 },
      GH: { code: 'GHS', symbol: '₵', rateToUSD: 15.8 },
      ZA: { code: 'ZAR', symbol: 'R', rateToUSD: 17.5 },
      US: { code: 'USD', symbol: '$', rateToUSD: 1.0 },
      EUR: { code: 'EUR', symbol: '€', rateToUSD: 0.92 }
    };

    const detected = currencyMap[countryCode] || currencyMap['NG'];

    return NextResponse.json({
      success: true,
      country: geoData.country || 'Nigeria',
      currency: detected
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve location currency' }, { status: 500 });
  }
}
