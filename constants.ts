
import { PrinterBrand, FilamentType, FilamentProfile } from './types';

export const PRINTER_BRANDS: PrinterBrand[] = [
  'Bambu Lab', 'Anycubic', 'Creality', 'Prusa', 'Ultimaker', 'Elegoo', 'Other'
];

export const FILAMENT_TYPES: FilamentType[] = [
  'PLA', 'ABS', 'PETG', 'TPU', 'ASA', 'Other'
];

export const PRESET_PROFILES: FilamentProfile[] = [
  {
    id: 'preset-1',
    profileName: 'Bambu Lab PLA Basic',
    printerBrand: 'Bambu Lab',
    filamentBrand: 'Bambu Lab',
    filamentType: 'PLA',
    filamentDiameter: 1.75,
    nozzleTemp: 220,
    bedTemp: 55,
    printSpeed: 150,
    retractionDistance: 0.8,
    retractionSpeed: 40,
    fanSpeed: 100,
    notes: 'A good starting point for Bambu PLA.',
  },
  {
    id: 'preset-2',
    profileName: 'Creality Ender 3 PETG',
    printerBrand: 'Creality',
    filamentBrand: 'Generic',
    filamentType: 'PETG',
    filamentDiameter: 1.75,
    nozzleTemp: 240,
    bedTemp: 70,
    printSpeed: 50,
    retractionDistance: 5,
    retractionSpeed: 45,
    fanSpeed: 50,
    notes: 'Works well for most PETG on an Ender 3.',
  },
    {
    id: 'preset-3',
    profileName: 'Anycubic Kobra TPU',
    printerBrand: 'Anycubic',
    filamentBrand: 'Generic',
    filamentType: 'TPU',
    filamentDiameter: 1.75,
    nozzleTemp: 225,
    bedTemp: 60,
    printSpeed: 30,
    retractionDistance: 2,
    retractionSpeed: 25,
    fanSpeed: 30,
    notes: 'Slow and steady for flexible filaments.',
  },
];
