import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title: string;
    description?: string;
    image?: string;
    path?: string;
}

/**
 * Reusable SEO component for dynamic meta tags across all pages.
 * Uses react-helmet-async for SSR-safe head management.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
    title,
    description = 'Celest AI - Your personalized astrological guide for self-discovery and daily insights.',
    image = '/assets/logo_v3.png',
    path = '',
}) => {
    const fullTitle = `${title} | Celest AI`;
    const baseUrl = 'https://celest.ai';
    const fullUrl = `${baseUrl}${path}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image.startsWith('http') ? image : `${baseUrl}${image}`} />
            <meta property="og:url" content={fullUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image.startsWith('http') ? image : `${baseUrl}${image}`} />
        </Helmet>
    );
};

export default SEOHead;
