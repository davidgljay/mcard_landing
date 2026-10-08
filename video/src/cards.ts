export type CardSpec = {
  id: string;
  name: string;
  image?: string;
  label?: string;
  color?: string;
};

export const communityCards: Record<string, CardSpec> = {
  salsa: {id: 'salsa', name: 'Waterfront Salsa Society', image: 'card-1.jpg'},
  youth: {id: 'youth', name: 'LGBT Center Youth Group', image: 'card-2.jpg'},
  mutualAid: {id: 'mutualAid', name: 'Neighborhood Mutual Aid Network', image: 'card-3.webp'},
  choir: {id: 'choir', name: 'Gospel Choir', image: 'card-4.jpg'},
  climate: {id: 'climate', name: 'Tech Workers for Climate Action', image: 'card-5.jpg'},
};

export const nurseCard: CardSpec = {
  id: 'nurse',
  name: 'Registered Nurse',
  label: 'Board of Nursing',
  color: '#16472f',
};
