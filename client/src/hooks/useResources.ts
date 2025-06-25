
import { useState, useEffect } from 'react';
import { ResourceList, ResourceType } from '@/types/resource';

const STORAGE_KEY = 'logistics-resources';

const defaultResources: ResourceList = {
  consignors: [],
  consignees: [],
  consignorLocations: [],
  consigneeLocations: [],
  truckNumbers: [],
  natureOfGoods: []
};

export const useResources = () => {
  const [resources, setResources] = useState<ResourceList>(defaultResources);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setResources(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored resources:', error);
      }
    }
  }, []);

  const saveResources = (newResources: ResourceList) => {
    setResources(newResources);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newResources));
  };

  const addResource = (type: ResourceType, value: string) => {
    if (!value.trim() || resources[type].includes(value.trim())) return;
    
    const newResources = {
      ...resources,
      [type]: [...resources[type], value.trim()]
    };
    saveResources(newResources);
  };

  const removeResource = (type: ResourceType, value: string) => {
    const newResources = {
      ...resources,
      [type]: resources[type].filter(item => item !== value)
    };
    saveResources(newResources);
  };

  return {
    resources,
    addResource,
    removeResource
  };
};
