import { useState, useEffect } from 'react'
import Cautare from './components/Cautare.jsx'
import PanouStatistici from './components/PanouStatistici.jsx'
import {
  getDestinatii,
  patchVizitat,
  deleteDestinatie,
  postDestinatie
} from './api/destinatii.js'
import {
  getNevizitate,
  totalZile,
  adaugaDestinatie,
  stergeDestinatie,
} from './utils/destinatii.js'
import Rezumat from './components/Rezumat.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import './App.css'

export default function App() {
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  const [seTrimite, setSeTrimite] = useState(false)
  const [textCautare, setTextCautare] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPagini, setTotalPagini] = useState(1)

 useEffect(() => {
    async function incarca() {
      try {
        setIncarcare(true); // arată loading la fiecare schimbare de pagină
        const datePaginare = await getDestinatii(pagina);
        
        // Extragem lista de 20 și totalul de pagini
        setDestinatii(datePaginare.data);
        setTotalPagini(datePaginare.pages);
      } catch (err) {
        setEroare(err.message);
      } finally {
        setIncarcare(false);
      }
    }
    incarca();
  }, [pagina]);

  async function handleToggle(id) {
    const destinatieCurenta = destinatii.find(d => d.id === id);
    if (!destinatieCurenta) return;

    try {
      const destinatieActualizata = await patchVizitat(id, !destinatieCurenta.vizitat);
      setDestinatii((curent) => 
        curent.map(d => d.id === id ? destinatieActualizata : d)
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAdd(destinatieNoua) {
  setSeTrimite(true);
  try {
    // Cerem serverului să salveze destinația (el îi va asocia un ID)
    const destinatieSalvata = await postDestinatie(destinatieNoua);
    
    // O adăugăm în listă folosind funcția ta utilitară
    setDestinatii((curent) => adaugaDestinatie(curent, destinatieSalvata));
  } catch (err) {
    console.error("Eroare la adăugarea destinației:", err);
  } finally {
    setSeTrimite(false);
  }
}

  async function handleDelete(id) {
    try {
      await deleteDestinatie(id);
      setDestinatii((curent) => stergeDestinatie(curent, id));
    } catch (err) {
      console.error(err);
    }
  }

 // Filtrarea listei
  const text = textCautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) =>
      d.oras.toLowerCase().includes(text) ||
      d.tara.toLowerCase().includes(text)
  )

  // Lasă doar O SINGURĂ linie cu nevizitate
  const nevizitate = getNevizitate(destinatii) 

  return (
    <main>
      <h1>City Explorer</h1>

      <PanouStatistici />
      
      {incarcare && <p className="stare">Se încarcă destinațiile...</p>}
      {eroare && <p className="stare eroare">{eroare}</p>}
      
      {!incarcare && !eroare && (
        <> {/* Aici ai deschis fragmentul */}
          <Rezumat
            total={destinatii.length}
            nevizitate={nevizitate.length}
            zile={totalZile(nevizitate)}
          />
         <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
          
          <Cautare valoare={textCautare} onChange={setTextCautare} />

          {/* Dacă nu există deloc destinații în aplicație */}
          {destinatii.length === 0 && (
            <p className="gol">
              Nu există nicio destinație.<br />
              Adaugă prima din formular.
            </p>
          )}

          {/* Dacă există destinații, dar căutarea nu a găsit nimic */}
          {destinatii.length > 0 && afisate.length === 0 && (
            <p className="gol">
              Niciun rezultat pentru „{textCautare}”.
            </p>
          )}

          {/* Dacă avem rezultate de afișat */}
          {destinatii.length > 0 && afisate.length > 0 && (
            <>
              <ListaDestinatii
                destinatii={afisate}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
              
              {/* Panoul de paginare */}
              <div className="paginare" style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
                <button 
                  disabled={pagina === 1} 
                  onClick={() => setPagina((p) => p - 1)}
                >
                  Înapoi
                </button>
                
                <span>Pagina {pagina} din {totalPagini}</span>
                
                <button 
                  disabled={pagina === totalPagini} 
                  onClick={() => setPagina((p) => p + 1)}
                >
                  Înainte
                </button>
              </div>
            </>
          )}
        </> /* Aici se închide fragmentul gol pentru incarcare/eroare */
      )}
    </main>
  )
}