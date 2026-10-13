export const getOrase = (list) => list.map(o => o.oras)
export const getNevizitate = (list) => list.filter(o => !o.vizitat)
export const totalZile = (list) => list.reduce((total, o) => total + o.zile, 0)
export const formatDestinatie = ({ oras, tara, zile, vizitat }) => 
  `[${vizitat ? 'x' : ' '}] ${oras}, ${tara} (${zile} zile)`
export const numarPeTara = (list) => 
  list.reduce((acc, { tara }) => ({ ...acc, [tara]: (acc[tara] ?? 0) + 1 }), {})
export const sortDupaZile = (list) => [...list].sort((a, b) => b.zile - a.zile)
export const marcheazaVizitat = (list, id) => 
  list.map(o => o.id === id ? { ...o, vizitat: !o.vizitat } : o)
export const adaugaDestinatie = (list, d) => [...list, d]
export const stergeDestinatie = (list, id) => list.filter(o => o.id !== id)