import axios from 'axios';

const ANAF_API_URL = 'https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva';

/**
 * Caută o companie în ANAF după CUI.
 * @param {string} cui - Codul Unic de Înregistrare
 * @returns {Promise<Object|null>} Datele companiei sau null
 */
export async function searchCompanyByCUI(cui: string) {
    try {
        const cleanCui = cui.replace(/\D/g, '');
        const cuiInt = parseInt(cleanCui, 10);
        const today = new Date().toISOString().split('T')[0];

        // Payload conform specificațiilor ANAF v9
        const payload = [
            {
                cui: cuiInt,
                data: today
            }
        ];

        console.log(`[ANAF] Searching for CUI: ${cuiInt} at ${ANAF_API_URL}`);

        const response = await axios.post(ANAF_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 secunde
        });

        if (response.data && response.data.found && response.data.found.length > 0) {
            const data = response.data.found[0];
            if (!data.date_generale) return null;

            const gen = data.date_generale;
            const adr = data.adresa_sediu_social;

            return {
                cui: cleanCui,
                companyName: gen.denumire,
                regCom: gen.nrRegCom,
                address: gen.adresa,
                city: adr?.sdenumire_Localitate || '-',
                county: adr?.sdenumire_Judet || '-',
                zipCode: adr?.scod_Postal || '',
                isVatPayer: data.inregistrare_scop_Tva?.scpTVA || false,
            };
        }

        return null;

    } catch (error) {
        console.error('[ANAF] Error fetching data:', error instanceof Error ? error.message : String(error));
        return null;
    }
}
