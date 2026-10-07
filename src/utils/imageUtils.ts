// Reliable image fallback helper and default high-fidelity verified assets

export const DEFAULT_IMAGES = {
  city: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
  pothole: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  water: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
  electric: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80',
  garbage: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
  park: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
  traffic: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
  resolved: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  avatarCitizen: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  avatarMunicipality: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  avatarContractor: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
};

// SVG data URI fallback in case any external URL fails to load
export const SVG_FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%230f172a'/%3E%3Cpath d='M0 380 Q 200 320 400 360 T 800 340 L 800 500 L 0 500 Z' fill='%230d9488' opacity='0.4'/%3E%3Ccircle cx='400' cy='220' r='50' fill='%23f97316' opacity='0.3'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='22' font-weight='bold'%3ECivic Infrastructure Evidence%3C/text%3E%3C/svg%3E";

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackUrl: string = DEFAULT_IMAGES.pothole
) => {
  const target = e.currentTarget;
  if (target.src !== fallbackUrl && target.src !== SVG_FALLBACK) {
    target.src = fallbackUrl;
  } else if (target.src !== SVG_FALLBACK) {
    target.src = SVG_FALLBACK;
  }
};
