export type ResourceStatus = 'ACTIVE' | 'OUT_OF_SERVICE' | 'MAINTENANCE';
export type ResourceType = 'LECTURE_HALL' | 'LAB' | 'EQUIPMENT';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  faculty: string;
  building: string;
  capacity: number;
  location: string;
  status: ResourceStatus;
  description: string;
}

const MOCK_RESOURCES: Resource[] = [
  { id: 'R-1', name: 'Main Auditorium', type: 'LECTURE_HALL', faculty: 'General', building: 'Main Building', capacity: 500, location: 'Ground Floor', status: 'ACTIVE', description: 'Large auditorium for major events.' },
  { id: 'R-2', name: 'Computing Lab 01', type: 'LAB', faculty: 'Computing', building: 'New Building', capacity: 50, location: '3rd Floor', status: 'ACTIVE', description: 'High-end PCs for programming.' },
  { id: 'R-3', name: 'Engineering Workshop', type: 'LAB', faculty: 'Engineering', building: 'Engineering Building', capacity: 30, location: 'Workshop Area', status: 'ACTIVE', description: 'Heavy machinery and tools.' },
  { id: 'R-4', name: 'BM Lecture Hall 01', type: 'LECTURE_HALL', faculty: 'Business', building: 'BM Building', capacity: 100, location: '2nd Floor', status: 'ACTIVE', description: 'Modern lecture hall for business students.' },
  { id: 'R-5', name: 'Projector 4K-01', type: 'EQUIPMENT', faculty: 'General', building: 'Main Building', capacity: 1, location: 'IT Dept Storage', status: 'ACTIVE', description: 'Portable 4K projector.' },
  { id: 'R-6', name: 'Physics Lab', type: 'LAB', faculty: 'Engineering', building: 'Engineering Building', capacity: 25, location: '1st Floor', status: 'MAINTENANCE', description: 'Lab for physics experiments.' },
  { id: 'R-7', name: 'Digital Lab', type: 'LAB', faculty: 'Computing', building: 'New Building', capacity: 40, location: '4th Floor', status: 'ACTIVE', description: 'Electronics and digital logic lab.' },
  { id: 'R-8', name: 'Conference Room 01', type: 'LECTURE_HALL', faculty: 'Business', building: 'BM Building', capacity: 20, location: '1st Floor', status: 'OUT_OF_SERVICE', description: 'Small room for meetings.' },
];

export const resourceService = {
  getResources: async (): Promise<Resource[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_RESOURCES;
  },

  createResource: async (data: Partial<Resource>): Promise<Resource> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newResource: Resource = {
      id: `R-${Math.floor(100 + Math.random() * 900)}`,
      status: 'ACTIVE',
      ...data
    } as Resource;
    MOCK_RESOURCES.unshift(newResource);
    return newResource;
  },

  updateResource: async (id: string, data: Partial<Resource>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_RESOURCES.findIndex(r => r.id === id);
    if (index !== -1) {
      MOCK_RESOURCES[index] = { ...MOCK_RESOURCES[index], ...data };
    }
  },

  deleteResource: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_RESOURCES.findIndex(r => r.id === id);
    if (index !== -1) {
      MOCK_RESOURCES.splice(index, 1);
    }
  }
};
