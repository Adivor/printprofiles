
import React from 'react';
import { FilamentProfile } from '../types';
import DownloadIcon from './icons/DownloadIcon';

interface CommunityProfilesProps {
  profiles: FilamentProfile[];
}

const CommunityProfiles: React.FC<CommunityProfilesProps> = ({ profiles }) => {

  const downloadJson = (profile: FilamentProfile) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ filament_profile: profile }, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    const safeName = profile.profileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeName}_${profile.printerBrand.replace(' ','')}_${profile.filamentType}.json`;
    link.click();
  };

  const ProfileCard: React.FC<{ profile: FilamentProfile }> = ({ profile }) => (
    <div className="bg-gray-700/50 rounded-lg p-4 flex flex-col justify-between transition-all duration-300 hover:bg-gray-700 hover:shadow-2xl hover:scale-[1.02]">
      <div>
        <h3 className="text-lg font-bold text-blue-300">{profile.profileName}</h3>
        <p className="text-sm text-gray-400 mb-2">{profile.printerBrand} - {profile.filamentBrand} {profile.filamentType}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-3">
          <span>Nozzle: <span className="font-semibold text-white">{profile.nozzleTemp}°C</span></span>
          <span>Bed: <span className="font-semibold text-white">{profile.bedTemp}°C</span></span>
          <span>Speed: <span className="font-semibold text-white">{profile.printSpeed} mm/s</span></span>
          <span>Fan: <span className="font-semibold text-white">{profile.fanSpeed}%</span></span>
        </div>
        {profile.notes && <p className="text-xs text-gray-300 italic bg-gray-800 p-2 rounded-md">"{profile.notes}"</p>}
      </div>
      <button
        onClick={() => downloadJson(profile)}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
      >
        <DownloadIcon />
        Download
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-white mb-2">Community Profiles</h2>
      <p className="text-center text-gray-400 mb-6">Browse and download profiles shared by other users.</p>
      {profiles.length === 0 ? (
        <p className="text-center text-gray-500">No community profiles available yet. Be the first to share one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(p => <ProfileCard key={p.id} profile={p} />)}
        </div>
      )}
    </div>
  );
};

export default CommunityProfiles;
