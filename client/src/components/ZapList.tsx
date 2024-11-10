import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';

interface ZapRecord {
  PseudoZAP: string;
  Presentation: string;
  Styles: string[];
  Instruments: string[];
  RoleCommunaute: string[];
}

const ZapList: React.FC = () => {
  const [records, setRecords] = useState<ZapRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ZapRecord[]>([]);
  
  const [searchPseudo, setSearchPseudo] = useState('');
  const [searchPresentation, setSearchPresentation] = useState('');
  const [filters, setFilters] = useState<{
    Styles: string[];
    Instruments: string[];
    RoleCommunaute: string[];
  }>({
    Styles: [],
    Instruments: [],
    RoleCommunaute: []
  });

  const [loading, setLoading] = useState(true); // Nouvel état pour le chargement

  // Chargement des données depuis le serveur (API backend)
  useEffect(() => {
    let isMounted = true;  // Indicateur pour vérifier si le composant est toujours monté

    const loadRecords = async () => {
      try {
        const response = await fetch('/api/zap-records');
        if (response.ok) {
          const zapRecords = await response.json();
          if (isMounted) {  // Vérifie si le composant est toujours monté avant de mettre à jour l'état
            setRecords(zapRecords);
            setFilteredRecords(zapRecords);
            setLoading(false); // Données chargées, donc on peut arrêter le chargement
          }
        } else {
          console.error('Erreur lors du chargement des enregistrements:', response.statusText);
          setLoading(false);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des enregistrements:', error);
        setLoading(false);
      }
    };

    loadRecords();

    return () => {
      isMounted = false;  // Nettoyage : indique que le composant est démonté
    };
  }, []);  // L'effet ne s'exécute qu'une seule fois après le premier rendu

  // Fonction pour extraire les valeurs uniques pour chaque filtre
  const getUniqueValues = (key: keyof ZapRecord) => {
    return Array.from(new Set(records.flatMap(record => record[key] || [])));
  };

  // Filtrage des enregistrements en fonction des critères
  useEffect(() => {
    let updatedRecords = records.filter(record => 
      // Filtrage par recherche fulltext sur Pseudo ZAP
      (record.PseudoZAP.toLowerCase().includes(searchPseudo.toLowerCase())) &&
      // Filtrage par recherche sur Présentation
      (record.Presentation.toLowerCase().includes(searchPresentation.toLowerCase())) &&
      // Filtrage par Styles de musique
      (filters.Styles.length === 0 || filters.Styles.some(style => record.Styles.includes(style))) &&
      // Filtrage par Instruments
      (filters.Instruments.length === 0 || filters.Instruments.some(instr => record.Instruments.includes(instr))) &&
      // Filtrage par Rôle(s) Communautés
      (filters.RoleCommunaute.length === 0 || filters.RoleCommunaute.some(role => record.RoleCommunaute.includes(role)))
    );
    setFilteredRecords(updatedRecords);
  }, [searchPseudo, searchPresentation, filters, records]);

  const handleFilterChange = (event: SelectChangeEvent<string[]>) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name as keyof typeof filters]: value as string[],
    });
  };

  return (
    <div>
      <TextField
        label="Recherche Pseudo ZAP"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchPseudo}
        onChange={(e) => setSearchPseudo(e.target.value)}
      />

      <TextField
        label="Recherche Présentation"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchPresentation}
        onChange={(e) => setSearchPresentation(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {['Styles', 'Instruments', 'RoleCommunaute'].map((field) => (
          <FormControl key={field} variant="outlined" fullWidth>
            <InputLabel>{field}</InputLabel>
            <Select
              multiple
              value={filters[field as keyof typeof filters]}
              onChange={handleFilterChange}
              input={<OutlinedInput label={field} />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              name={field}
            >
              {getUniqueValues(field as keyof ZapRecord).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <CircularProgress />
        </div>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pseudo ZAP</TableCell>
                <TableCell>Présentation</TableCell>
                <TableCell>Styles de musique</TableCell>
                <TableCell>Instruments</TableCell>
                <TableCell>Rôle(s) Communautés</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.PseudoZAP}</TableCell>
                  <TableCell>{record.Presentation}</TableCell>
                  <TableCell>{record.Styles.join(', ')}</TableCell>
                  <TableCell>{record.Instruments.join(', ')}</TableCell>
                  <TableCell>{record.RoleCommunaute.join(', ')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ZapList;
