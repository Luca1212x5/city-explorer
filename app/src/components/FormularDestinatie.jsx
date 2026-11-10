import { useState } from 'react'

// Funcția separată pentru verificarea datelor
function valideaza(valori) {
  const erori = {}
  
  if (valori.oras.trim().length < 2) {
    erori.oras = 'Orașul are cel puțin două caractere.'
  }
  
  if (valori.tara.trim() === '') {
    erori.tara = 'Țara este obligatorie.'
  }
  
  const nrZile = Number(valori.zile)
  if (valori.zile === '' || Number.isNaN(nrZile) || nrZile < 1 || nrZile > 30) {
    erori.zile = 'Numărul de zile este între 1 și 30.'
  }
  
  return erori
}

export default function FormularDestinatie({ onAdd, seTrimite }) {
  // 1. Un singur obiect pentru toate cele 3 câmpuri
  const [valori, setValori] = useState({ oras: '', tara: '', zile: '' })
  const [erori, setErori] = useState({})

  // O singură funcție pentru a actualiza starea oricărui input
  function handleChange(event) {
    const { name, value } = event.target
    setValori((curent) => ({ ...curent, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    
    // 2. Validăm datele
    const eroriGasite = valideaza(valori)
    if (Object.keys(eroriGasite).length > 0) {
      setErori(eroriGasite)
      return // Oprim trimiterea dacă sunt erori
    }

    setErori({})
    
    // 3. Trimitem datele către funcția onAdd (fără id, pentru că îl pune serverul)
    onAdd({
      oras: valori.oras.trim(),
      tara: valori.tara.trim(),
      zile: Number(valori.zile),
      vizitat: false,
    })

    // Golim formularul
    setValori({ oras: '', tara: '', zile: '' })
  }

  return (
    // noValidate oprește mesajele implicite ale browserului
    <form className="formular" onSubmit={handleSubmit} noValidate>
      <div className="camp">
        <input
          name="oras"
          type="text"
          placeholder="Oraș"
          value={valori.oras}
          onChange={handleChange}
          className={erori.oras ? 'invalid' : ''}
        />
        {erori.oras && <p className="eroare-camp">{erori.oras}</p>}
      </div>

      <div className="camp">
        <input
          name="tara"
          type="text"
          placeholder="Țară"
          value={valori.tara}
          onChange={handleChange}
          className={erori.tara ? 'invalid' : ''}
        />
        {erori.tara && <p className="eroare-camp">{erori.tara}</p>}
      </div>

      <div className="camp">
        <input
          name="zile"
          type="number"
          placeholder="Zile"
          value={valori.zile}
          onChange={handleChange}
          className={erori.zile ? 'invalid' : ''}
        />
        {erori.zile && <p className="eroare-camp">{erori.zile}</p>}
      </div>

      <button type="submit" disabled={seTrimite}>
        {seTrimite ? 'Se trimite...' : 'Adaugă'}
      </button>
    </form>
  )
}