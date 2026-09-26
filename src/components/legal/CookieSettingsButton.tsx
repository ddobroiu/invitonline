'use client'

import { openCookieSettings } from '@/lib/consent'

export default function CookieSettingsButton() {
    return (
        <button type="button" onClick={openCookieSettings} className="btn-primary">
            Setări cookies
        </button>
    )
}
