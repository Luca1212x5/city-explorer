import { useState, useEffect } from 'react';

export default function PanouStatistici() {
  const [destinatii, setDestinatii] = useState([]);
  const [prag, setPrag] = useState(3);

  useEffect(() => {
    async function incarcaStatistici() {
      try {
        const response = await fetch('http://localhost:3001/destinatii');
        const data = await response.json();
        
        // Dacă baza de date vine normal sau sub formă de obiect (paginat)
        const lista = Array.isArray(data) ? data : (data.data || []);
        setDestinatii(lista);
      } catch (err) {
        console.error("Eroare la panou:", err);
      }
    }
    incarcaStatistici();
  }, []);

  // Calculele pentru statistici
  const destinatiiEligibile = destinatii.filter(d => d.zile >= prag);
  const totalZile = destinatiiEligibile.reduce((suma, d) => suma + d.zile, 0);
  const mediaZile = destinatiiEligibile.length > 0 ? totalZile / destinatiiEligibile.length : 0;

  return (
    <section className="panou">
      <h2>Statistici</h2>
      <p>
        Cel puțin{' '}
        <input
          type="number"
          min="1"
          value={prag}
          onChange={(e) => setPrag(Number(e.target.value))}
        />{' '}
        zile
      </p>

      {destinatiiEligibile.length === 0 ? (
        <div className="gol">
          Nicio destinație cu cel puțin {prag} zile.
        </div>
      ) : (
        <ul>
          <li>Destinații: {destinatiiEligibile.length}</li>
          <li>Total zile: {totalZile}</li>
          <li>Media: {mediaZile} zile</li>
        </ul>
      )}
    </section>
  );
}