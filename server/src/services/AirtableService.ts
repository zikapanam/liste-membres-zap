import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();  // Charger les variables d'environnement

export interface ZapRecord {
  PseudoZAP: string;
  Presentation: string;
  Styles: string[];
  Instruments: string[];
  RoleCommunaute: string[];
}

// Mapping des noms de champs Airtable vers des noms de propriétés dans l'interface
const FIELD_MAPPINGS = {
  PseudoZAP: 'Pseudo ZAP',
  Presentation: 'Présentation',
  Styles: 'Styles de musique',
  Instruments: 'Instruments',
  RoleCommunaute: 'Role(s) Communauté(s)',
};

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error('Clé API ou Base ID manquants dans le fichier .env');
  process.exit(1);
}

const base = new Airtable({ apiKey }).base(baseId);

// Définir le type pour le callback fetchNextPage
type FetchNextPage = (err: Error | null) => void;

export const fetchZapRecords = async (): Promise<ZapRecord[]> => {
  const records: ZapRecord[] = [];

  console.log('Démarrage de la récupération des enregistrements...');

  // Encapsuler la méthode eachPage dans une Promesse pour pouvoir l'attendre
  await new Promise<void>((resolve, reject) => {
    base('Membres ZAP').select({
      view: 'Membres cotisants',  // Remplace cela par la vue que tu veux utiliser
      fields: ['Pseudo ZAP', 'Présentation', 'Styles de musique', 'Instruments', 'Role(s) Communauté(s)']  // Spécifiez ici les champs à récupérer
    }).eachPage((pageRecords: Airtable.Records<Airtable.FieldSet>, fetchNextPage: FetchNextPage) => {
      console.log(`Page récupérée, nombre d'enregistrements: ${pageRecords.length}`);

      pageRecords.forEach((record: Airtable.Record<Airtable.FieldSet>) => {
        const fields = record.fields;

        console.log('Enregistrement traité:', fields);

        records.push({
          // Si le champ est 'undefined' ou d'un autre type, mettre une chaîne vide par défaut
          PseudoZAP: typeof fields[FIELD_MAPPINGS.PseudoZAP] === 'string'
            ? fields[FIELD_MAPPINGS.PseudoZAP] as string 
            : '',

          // Pour 'Presentation', traiter de la même manière
          Presentation: typeof fields[FIELD_MAPPINGS.Presentation] === 'string' 
            ? fields[FIELD_MAPPINGS.Presentation] as string
            : '',

          // Pour 'Styles', vérifier si c'est un tableau, sinon mettre un tableau vide
          Styles: Array.isArray(fields[FIELD_MAPPINGS.Styles]) 
            ? fields[FIELD_MAPPINGS.Styles] as string[] 
            : [],

          // Pour 'Instruments', vérifier si c'est un tableau, sinon mettre un tableau vide
          Instruments: Array.isArray(fields[FIELD_MAPPINGS.Instruments]) 
            ? fields[FIELD_MAPPINGS.Instruments] as string[] 
            : [],

          // Pour 'RoleCommunaute', vérifier si c'est une chaîne avant de la diviser
          RoleCommunaute: typeof fields[FIELD_MAPPINGS.RoleCommunaute] === 'string'
          ? (fields[FIELD_MAPPINGS.RoleCommunaute] as string).trim().split(' ').map((item: string) => item.trim())
          : [],  // Si ce n'est pas une chaîne, mettre un tableau vide
        });
      });

      fetchNextPage(null); // Passer `null` comme argument pour continuer sans erreur
    }, (err: Error | null) => {
      if (err) {
        reject(err);  // Si une erreur survient, la Promesse est rejetée
      } else {
        console.log('Tous les enregistrements ont été traités');
        resolve();  // Si tout se passe bien, la Promesse est résolue
      }
    });
  });

  console.log(`Nombre d'enregistrements traités: ${records.length}`);

  if (records.length === 0) {
    console.log('Aucun enregistrement trouvé.');
  }

  return records;
};
