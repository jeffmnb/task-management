import { Injectable } from '@nestjs/common';
import { Property, PropertyStatus } from './property.types';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PropertyService {
  private properties: Property[] = [];

  getAllProperties(): Property[] {
    return this.properties;
  }

  getPropertyById(propertyId: string) {
    return this.properties.find(({ id }) => propertyId === id);
  }

  createNewProperty(property: Property): Property {
    const { name, year } = property;
    const newProperty: Property = {
      id: uuid(),
      name,
      status: PropertyStatus.NEW,
      year,
    };
    this.properties.push(newProperty);
    return newProperty;
  }
}
