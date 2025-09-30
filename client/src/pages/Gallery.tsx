import { useQuery } from '@tanstack/react-query';

export default function Gallery() {
  const { data: professionals = [] } = useQuery({
    queryKey: ['/api/professionals'],
  });

  const { data: allImages = [], isLoading } = useQuery({
    queryKey: ['/api/gallery/1'],
    enabled: professionals.length > 0,
  });

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', textAlign: 'center' }}>
          Galeria de Trabalhos
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem', fontSize: '1.125rem' }}>
          Confira nosso portfólio de trabalhos realizados
        </p>

        {allImages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📸</div>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-light)' }}>
              Galeria em construção. Em breve teremos imagens dos nossos trabalhos!
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {allImages.map((image: any) => (
              <div key={image.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <img 
                  src={image.imageUrl} 
                  alt={image.caption || 'Gallery image'} 
                  style={{ 
                    width: '100%', 
                    height: '300px', 
                    objectFit: 'cover',
                    display: 'block'
                  }} 
                />
                {image.caption && (
                  <div style={{ padding: '1rem' }}>
                    <p style={{ color: 'var(--text)', fontWeight: '500' }}>{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
