
import React, { useState } from 'react';
import { FilamentProfile, PrinterBrand, FilamentType } from '../types';
import { PRINTER_BRANDS, FILAMENT_TYPES } from '../constants';
import { suggestFilamentSettings } from '../services/geminiService';
import DownloadIcon from './icons/DownloadIcon';
import ShareIcon from './icons/ShareIcon';
import MagicIcon from './icons/MagicIcon';


interface CreateProfileFormProps {
  onShare: (profile: FilamentProfile) => void;
}

const initialProfileState: Omit<FilamentProfile, 'id'> = {
  profileName: '',
  printerBrand: 'Bambu Lab',
  filamentBrand: '',
  filamentType: 'PLA',
  filamentDiameter: 1.75,
  nozzleTemp: 220,
  bedTemp: 60,
  printSpeed: 60,
  retractionDistance: 1,
  retractionSpeed: 40,
  fanSpeed: 100,
  notes: '',
};

const CreateProfileForm: React.FC<CreateProfileFormProps> = ({ onShare }) => {
  const [profile, setProfile] = useState<Omit<FilamentProfile, 'id'>>(initialProfileState);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: name.match(/Temp|Speed|Distance|Diameter/) ? parseFloat(value) || 0 : value }));
  };

  const handleAISuggest = async () => {
    if (!process.env.API_KEY) {
        setError("API_KEY is not configured. AI suggestions are disabled.");
        return;
    }
    setIsSuggesting(true);
    setError(null);
    try {
      const suggestions = await suggestFilamentSettings(profile.printerBrand, profile.filamentType, profile.filamentBrand);
      setProfile(prev => ({ ...prev, ...suggestions }));
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const downloadJson = () => {
    if (!profile.profileName) {
        alert("Please provide a profile name before downloading.");
        return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ filament_profile: profile }, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    const safeName = profile.profileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeName}_${profile.printerBrand.replace(' ','')}_${profile.filamentType}.json`;
    link.click();
  };

  const handleShare = () => {
      if (!profile.profileName) {
        alert("Please provide a profile name before sharing.");
        return;
    }
    const newProfile: FilamentProfile = {
      ...profile,
      id: `user-${new Date().getTime()}`,
    };
    onShare(newProfile);
    alert("Profile shared to the community tab!");
  };

  const InputField: React.FC<{label: string, name: keyof typeof initialProfileState, type?: string, value: any, step?: string, children?: React.ReactNode}> = ({ label, name, type = 'text', value, step, children }) => (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-400">{label}</label>
      {children ? children :
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          step={step}
          className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      }
    </div>
  );

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-center text-white mb-2">Create a New Filament Profile</h2>
       <p className="text-center text-gray-400 mb-6">Fill in the details below or use AI to suggest settings for you.</p>

        {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md text-center">{error}</div>}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Profile Name" name="profileName" value={profile.profileName} />
            <InputField label="Filament Brand" name="filamentBrand" value={profile.filamentBrand} />
            <InputField label="Printer Brand" name="printerBrand" value={profile.printerBrand}>
                <select id="printerBrand" name="printerBrand" value={profile.printerBrand} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    {PRINTER_BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
            </InputField>
             <InputField label="Filament Type" name="filamentType" value={profile.filamentType}>
                <select id="filamentType" name="filamentType" value={profile.filamentType} onChange={handleChange} className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    {FILAMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </InputField>
       </div>

        <div className="border-t border-gray-700 my-6"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <InputField label="Nozzle Temp (°C)" name="nozzleTemp" type="number" value={profile.nozzleTemp} />
            <InputField label="Bed Temp (°C)" name="bedTemp" type="number" value={profile.bedTemp} />
            <InputField label="Print Speed (mm/s)" name="printSpeed" type="number" value={profile.printSpeed} />
            <InputField label="Retraction Dist. (mm)" name="retractionDistance" type="number" value={profile.retractionDistance} step="0.1" />
            <InputField label="Retraction Spd. (mm/s)" name="retractionSpeed" type="number" value={profile.retractionSpeed} />
            <InputField label="Fan Speed (%)" name="fanSpeed" type="number" value={profile.fanSpeed} />
        </div>

        <div>
            <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-400">Notes</label>
            <textarea
                id="notes"
                name="notes"
                value={profile.notes}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., Good for detailed prints, requires glue stick."
            ></textarea>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
                onClick={handleAISuggest}
                disabled={isSuggesting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105 disabled:bg-purple-800 disabled:cursor-not-allowed"
            >
                {isSuggesting ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Optimizing...
                    </>
                ) : (
                    <>
                        <MagicIcon />
                        Suggest Settings with AI
                    </>
                )}
            </button>
             <button
                onClick={downloadJson}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105"
            >
                <DownloadIcon />
                Download JSON
            </button>
            <button
                onClick={handleShare}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-transform transform hover:scale-105"
            >
                <ShareIcon />
                Share
            </button>
        </div>
    </div>
  );
};

export default CreateProfileForm;
