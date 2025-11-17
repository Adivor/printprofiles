
export type FilamentType = 'PLA' | 'ABS' | 'PETG' | 'TPU' | 'ASA' | 'Other';
export type PrinterBrand = 'Bambu Lab' | 'Anycubic' | 'Creality' | 'Prusa' | 'Ultimaker' | 'Elegoo' | 'Other';

export interface FilamentProfile {
  id: string;
  profileName: string;
  printerBrand: PrinterBrand;
  filamentBrand: string;
  filamentType: FilamentType;
  filamentDiameter: number;
  nozzleTemp: number;
  bedTemp: number;
  printSpeed: number;
  retractionDistance: number;
  retractionSpeed: number;
  fanSpeed: number;
  notes?: string;
}
