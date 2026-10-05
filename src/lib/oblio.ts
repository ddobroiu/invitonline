import axios from 'axios';

// Oblio Configuration
const OBLIO_EMAIL = process.env.OBLIO_EMAIL || process.env.OBLIO_CLIENT_ID;
const OBLIO_API_KEY = process.env.OBLIO_API_KEY || process.env.OBLIO_CLIENT_SECRET;
const OBLIO_CIF_FIRMA = process.env.OBLIO_CIF_FIRMA;
const OBLIO_SERIE_FACTURA = process.env.OBLIO_SERIE_FACTURA;

// Cache token
let cachedToken: string | null = null;
let tokenExpiry: Date | null = null;

async function getAccessToken() {
    if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
        return cachedToken;
    }

    try {
        console.log("Oblio: Requesting access token...");
        const response = await fetch('https://www.oblio.eu/api/authorize/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: OBLIO_EMAIL,
                client_secret: OBLIO_API_KEY,
                grant_type: 'client_credentials'
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Auth failed: ${response.status} ${errText}`);
        }

        const data = await response.json();
        cachedToken = data.access_token;
        tokenExpiry = new Date(new Date().getTime() + (data.expires_in * 1000));

        return cachedToken;
    } catch (error) {
        console.error("Oblio Auth Error:", error);
        throw error;
    }
}

export interface OblioProduct {
    name: string;
    code?: string;
    description?: string;
    price: number;
    quantity: number;
    currency?: string;
    vatName?: string;
    vatPercentage?: number;
    vatIncluded?: boolean;
}

export async function createInvoice(clientData: { cif?: string; name: string; rc?: string; address?: string; city?: string; county?: string; email?: string }, products: OblioProduct[]) {
    const token = await getAccessToken();

    let issuerCif = OBLIO_CIF_FIRMA || '';
    issuerCif = issuerCif.toUpperCase().trim();
    if (/^\d+$/.test(issuerCif)) {
        issuerCif = 'RO' + issuerCif;
    }

    const invoiceData = {
        cif: issuerCif,
        client: {
            cif: clientData.cif,
            name: clientData.name,
            rc: clientData.rc || '',
            address: clientData.address || '-',
            city: clientData.city || '-',
            county: clientData.county || '-',
            country: 'RO',
            email: clientData.email,
            save: true
        },
        issueDate: new Date().toISOString().split('T')[0],
        seriesName: OBLIO_SERIE_FACTURA || '',
        language: 'RO',
        products: products.map(p => ({
            name: p.name,
            code: p.code || '',
            description: p.description || '',
            price: p.price,
            measuringUnitName: 'buc',
            currency: p.currency || 'RON',
            // Societatea nu este platitoare de TVA: fara cota impusa, se aplica setarea firmei din Oblio
            ...(p.vatName ? { vatName: p.vatName } : {}),
            ...(p.vatPercentage !== undefined ? { vatPercentage: p.vatPercentage } : {}),
            vatIncluded: p.vatIncluded ?? true,
            quantity: p.quantity,
            save: false
        }))
    };

    const url = `https://www.oblio.eu/api/docs/invoice?cif=${issuerCif}`;

    try {
        console.log(`Oblio: Creating invoice for ${clientData.name}...`);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(invoiceData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Oblio Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Oblio creation failed:", error);
        throw error;
    }
}
