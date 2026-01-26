'use client'

import { useState, useRef, useEffect } from 'react'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import { MapPin, Loader2, Navigation } from 'lucide-react'
import styles from '@/app/create/page.module.css'

interface LocationPickerProps {
    onLocationSelect: (address: string, url: string) => void
    initialValue?: string
}

const libraries: any = ["places"]

export default function LocationPicker({ onLocationSelect, initialValue }: LocationPickerProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    })

    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
    const [address, setAddress] = useState(initialValue || '')

    const onLoad = (auto: google.maps.places.Autocomplete) => {
        setAutocomplete(auto)
    }

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace()
            const formattedAddress = place.formatted_address || place.name || ''

            // Construct a clean Google Maps URL
            // place.url is usually the full google maps link for that place
            const mapsUrl = place.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}&query_place_id=${place.place_id}`

            setAddress(formattedAddress)
            onLocationSelect(formattedAddress, mapsUrl)
        } else {
            console.log('Autocomplete is not loaded yet!')
        }
    }

    if (loadError) return <div style={{ color: 'red', fontSize: '10px' }}>Error loading maps</div>
    if (!isLoaded) return <div style={{ opacity: 0.5, fontSize: '10px' }}><Loader2 className="animate-spin" size={10} /></div>

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Caută locația (ex: Restaurant Grand, Oraș...)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={{
                            paddingLeft: '45px',
                            width: '100%',
                            fontSize: '1.1rem',
                            paddingTop: '1.3rem',
                            paddingBottom: '1.3rem'
                        }}
                    />
                    <MapPin
                        size={22}
                        style={{
                            position: 'absolute',
                            left: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#d4af37'
                        }}
                    />
                </div>
            </Autocomplete>
        </div>
    )

}
