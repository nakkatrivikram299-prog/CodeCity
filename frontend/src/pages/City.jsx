import { useState, useMemo, useCallback } from 'react';
import GlassNavbar from '../components/ui/GlassNavbar.jsx';
import FloatingDock from '../components/ui/FloatingDock.jsx';
import MiniMap from '../components/ui/MiniMap.jsx';
import CameraControlsOverlay from '../components/ui/CameraControlsOverlay.jsx';
import BuildingModal from '../components/ui/BuildingModal.jsx';
import SmartCityCanvas from '../components/3d/SmartCityCanvas.jsx';
import { HACKATHON_PROJECTS } from '../data/projectsData.js';

export default function City() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState('all');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isNight, setIsNight] = useState(true);

  // Filter hackathon project buildings by search query or domain category
  const filteredBuildings = useMemo(() => {
    return HACKATHON_PROJECTS.filter((b) => {
      const matchesSearch =
        !searchQuery ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.domainLabel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain =
        activeDomain === 'all' || b.domain === activeDomain;

      return matchesSearch && matchesDomain;
    });
  }, [searchQuery, activeDomain]);

  const handleSelectBuilding = useCallback((building) => {
    setSelectedBuilding(building);
  }, []);

  const handleSelectBuildingById = useCallback((buildingId) => {
    const found = HACKATHON_PROJECTS.find((b) => b.id === buildingId);
    if (found) {
      setSelectedBuilding(found);
    }
  }, []);

  const handleResetView = useCallback(() => {
    setSelectedBuilding(null);
    setActiveDomain('all');
    setSearchQuery('');
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base text-ink select-none">
      
      {/* Translucent Glass Top Navbar */}
      <GlassNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isNight={isNight}
        onToggleNight={() => setIsNight(!isNight)}
        onSelectBuildingById={handleSelectBuildingById}
      />

      {/* Main 3D Smart City Viewport */}
      <div className="relative flex-1">
        
        {/* Top-Left Camera & Domain Filters Overlay */}
        <CameraControlsOverlay
          onResetView={handleResetView}
          activeDomain={activeDomain}
          onDomainChange={setActiveDomain}
        />

        {/* Full-Screen Interactive 3D Canvas */}
        <SmartCityCanvas
          buildings={filteredBuildings}
          selectedBuilding={selectedBuilding}
          onSelectBuilding={handleSelectBuilding}
          isNight={isNight}
        />

        {/* Bottom Center macOS-Style Floating Dock */}
        <FloatingDock
          onSelectBuildingById={handleSelectBuildingById}
          onResetView={handleResetView}
        />

        {/* Bottom Right Interactive Mini-Map */}
        <MiniMap
          buildings={HACKATHON_PROJECTS}
          selectedBuilding={selectedBuilding}
          onSelectBuilding={handleSelectBuilding}
        />

        {/* Slide-out Project Showcase Modal for Clicked Building */}
        {selectedBuilding && (
          <BuildingModal
            building={selectedBuilding}
            onClose={() => setSelectedBuilding(null)}
          />
        )}

      </div>
    </div>
  );
}
