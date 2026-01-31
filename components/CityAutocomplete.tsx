import React, { useState, useEffect, useRef } from 'react';

interface CityResult {
    display_name: string;    // "Santa Cruz do Sul, Rio Grande do Sul, Brasil"
    lat: string;
    lon: string;
    place_id: number;
}

interface CityAutocompleteProps {
    value: string;
    onChange: (city: string, lat?: number, lon?: number) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

/**
 * Professional City Autocomplete Component
 * Uses OpenStreetMap Nominatim for FREE disambiguation
 * Shows dropdown with full location (City, State, Country)
 */
export default function CityAutocomplete({
    value,
    onChange,
    placeholder = "Digite a cidade...",
    className = "",
    disabled = false
}: CityAutocompleteProps) {
    const [query, setQuery] = useState(value);
    const [results, setResults] = useState<CityResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync external value
    useEffect(() => {
        setQuery(value);
    }, [value]);

    // Debounced search
    const searchCity = async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);

        try {
            // OpenStreetMap Nominatim API (FREE - No API Key!)
            const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(searchQuery)}`;

            const response = await fetch(url, {
                headers: {
                    'Accept-Language': 'pt-BR,pt,en',
                    'User-Agent': 'CelestAI/1.0'
                }
            });

            if (response.ok) {
                const data: CityResult[] = await response.json();
                // Filter to only show places with cities/towns
                const cities = data.filter(r =>
                    r.display_name &&
                    (r.display_name.includes(','))
                );
                setResults(cities);
                setIsOpen(cities.length > 0);
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setQuery(newValue);

        // Debounce API calls (300ms)
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            searchCity(newValue);
        }, 300);
    };

    const handleSelect = (result: CityResult) => {
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        // Pass full display name + coordinates to parent
        onChange(result.display_name, lat, lon);
        setQuery(result.display_name);
        setIsOpen(false);
        setResults([]);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => results.length > 0 && setIsOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 
                   text-white placeholder:text-white/50 outline-none 
                   focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20
                   transition-all ${className}`}
                autoComplete="off"
            />

            {/* Loading indicator */}
            {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                </div>
            )}

            {/* Dropdown with results */}
            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-[#1c1c2e] border border-white/20 rounded-xl 
                        shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                    <div className="px-3 py-2 text-xs text-white/50 bg-white/5">
                        🌍 Selecione a localização correta:
                    </div>
                    {results.map((result, index) => (
                        <button
                            key={result.place_id || index}
                            onClick={() => handleSelect(result)}
                            className="w-full px-4 py-3 text-left text-white hover:bg-cyan-500/20 
                         border-b border-white/10 last:border-b-0 transition-colors"
                        >
                            <div className="text-sm font-medium truncate">
                                {result.display_name.split(',')[0]}
                            </div>
                            <div className="text-xs text-white/60 truncate">
                                {result.display_name.split(',').slice(1).join(',')}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Helper text */}
            {query.length > 0 && query.length < 3 && (
                <div className="text-xs text-white/40 mt-1">
                    Digite pelo menos 3 caracteres...
                </div>
            )}
        </div>
    );
}
