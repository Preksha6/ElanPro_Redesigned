const cities = [
  { id: 'gurugram', lat: 28.4595, lng: 77.0266, isOrigin: true },
  { id: 'delhi', lat: 28.6139, lng: 77.2090 },
  { id: 'chandigarh', lat: 30.7333, lng: 76.7794 },
  { id: 'dehradun', lat: 30.3165, lng: 78.0322 },
  { id: 'jaipur', lat: 26.9124, lng: 75.7873 },
  { id: 'lucknow', lat: 26.8467, lng: 80.9462 },
  { id: 'kolkata', lat: 22.5726, lng: 88.3639 },
  { id: 'ahmedabad', lat: 23.0225, lng: 72.5714 },
  { id: 'bhopal', lat: 23.2599, lng: 77.4126 },
  { id: 'mumbai', lat: 19.0760, lng: 72.8777 },
  { id: 'hyderabad', lat: 17.3850, lng: 78.4867 },
  { id: 'bengaluru', lat: 12.9716, lng: 77.5946 },
  { id: 'chennai', lat: 13.0827, lng: 80.2707 },
  { id: 'kochi', lat: 9.9312, lng: 76.2673 },
];

// India bounding box (approximate for SVG projection)
const latMin = 8.088; // Kanyakumari
const latMax = 37.085; // Kashmir
const lngMin = 68.162; // Gujarat
const lngMax = 97.395; // Arunachal

const width = 612;
const height = 696;

cities.forEach(c => {
  const x = Math.round(((c.lng - lngMin) / (lngMax - lngMin)) * width);
  const y = Math.round(((latMax - c.lat) / (latMax - latMin)) * height);
  const region = c.id === 'kochi' || c.id === 'chennai' || c.id === 'bengaluru' || c.id === 'hyderabad' ? 'South India'
               : c.id === 'kolkata' ? 'East India'
               : c.id === 'ahmedabad' || c.id === 'mumbai' || c.id === 'jaipur' ? 'West India'
               : c.id === 'bhopal' ? 'Central India'
               : 'North India';
  
  const originStr = c.isOrigin ? ", isOrigin: true" : "";
  console.log(`{ id: '${c.id}', name: '${c.id.charAt(0).toUpperCase() + c.id.slice(1)}', region: '${region}', x: ${x}, y: ${y}${originStr} },`);
});
