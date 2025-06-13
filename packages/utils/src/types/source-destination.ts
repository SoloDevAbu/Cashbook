export interface SourceDestination {
  id: string;
  name: string;
  gst: string;
  pan: string;
  address: string;
  state: string;
  pin: string;
  country: string;
  nationalId: string;
  details?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateSourceDestinationInput = Omit<SourceDestination, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSourceDestinationInput = Partial<CreateSourceDestinationInput>;