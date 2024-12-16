import { Geolocation } from '@nativescript/geolocation';

export const getCurrentLocation = async () => {
  const hasPermission = await Geolocation.enableLocationRequest();
  if (!hasPermission) {
    throw new Error('Location permission denied');
  }
  
  return await Geolocation.getCurrentLocation({
    desiredAccuracy: 3,
    maximumAge: 5000,
    timeout: 10000
  });
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (value: number): number => {
  return value * Math.PI / 180;
};