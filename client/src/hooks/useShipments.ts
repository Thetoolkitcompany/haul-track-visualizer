
import { useState, useEffect } from 'react';
import { Shipment } from '@/types/shipment';

const STORAGE_KEY = 'logistics-crm-shipments';

export const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setShipments(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored shipments:', error);
      }
    }
  }, []);

  const saveShipments = (newShipments: Shipment[]) => {
    setShipments(newShipments);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newShipments));
  };

  const addShipment = (shipment: Omit<Shipment, 'id'>) => {
    const newShipment: Shipment = {
      ...shipment,
      id: Date.now().toString(),
    };
    const updatedShipments = [...shipments, newShipment];
    saveShipments(updatedShipments);
  };

  const updateShipment = (id: string, updates: Partial<Shipment>) => {
    const updatedShipments = shipments.map(shipment =>
      shipment.id === id ? { ...shipment, ...updates } : shipment
    );
    saveShipments(updatedShipments);
  };

  const deleteShipment = (id: string) => {
    const updatedShipments = shipments.filter(shipment => shipment.id !== id);
    saveShipments(updatedShipments);
  };

  return {
    shipments,
    addShipment,
    updateShipment,
    deleteShipment,
  };
};
