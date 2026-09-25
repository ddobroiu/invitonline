'use client'

import { useState } from 'react'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'
import styles from '@/app/create/page.module.css'

interface LocationPickerProps {
    value: string
    onChange: (address: string, url: string) => void
    placeholder?: string
    id?: string
    invalid?: boolean
}

const libraries: ('places')[] = ['places']
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

// Google Maps search link used when a place wasn't picked from autocomplete
export function mapsSearchUrl(address: string) {
    return address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : ''
}

function LocationInput({ value, onChange, placeholder, id, invalid }: LocationPickerProps) {
    return (
        <div style={{ position: 'relative' }}>
            <input
                id={id}
                type="text"
                aria-invalid={invalid || undefined}
                autoComplete="off"
                className={`${styles.input} ${invalid ? styles.inputError : ''}`}
                placeholder={placeholder || 'Ex: Restaurant Grand, București'}
                value={value}
                onChange={(e) => onChange(e.target.value, mapsSearchUrl(e.target.value))}
                style={{ paddingLeft: '44px', width: '100%' }}
            />
            <MapPin
                size={20}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#d4af37', pointerEvents: 'none' }}
            />
        </div>
    )
}

function GoogleLocationPicker(props: LocationPickerProps) {
    const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: API_KEY, libraries })
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)

    if (loadError || !isLoaded) return <LocationInput {...props} />

    const onPlaceChanged = () => {
        if (!autocomplete) return
        const place = autocomplete.getPlace()
        const name = place.name && place.formatted_address && !place.formatted_address.startsWith(place.name)
            ? `${place.name}, ${place.formatted_address}`
            : place.formatted_address || place.name || props.value
        props.onChange(name, place.url || mapsSearchUrl(name))
    }

    return (
        <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
            <LocationInput {...props} />
        </Autocomplete>
    )
}

export default function LocationPicker(props: LocationPickerProps) {
    // Without an API key, fall back to a plain text field with a Maps search link
    return API_KEY ? <GoogleLocationPicker {...props} /> : <LocationInput {...props} />
}
