import { Injectable } from '@nestjs/common';
import { Property, PropertyStatus } from './property.types';
import { v4 as uuid } from 'uuid';
import {
  CreateNewPropertyDto,
  GetPropertyByIdDTO,
  UpdatePropertyStatusDTO,
} from './dtos/property.dtos';

@Injectable()
export class PropertyService {
  private properties: Property[] = [];

  getAllProperties(): Property[] {
    return this.properties;
  }

  getPropertyById({ id: propertyId }: GetPropertyByIdDTO) {
    return this.properties.find(({ id }) => propertyId === id);
  }

  createNewProperty(property: CreateNewPropertyDto): Property {
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

  updatePropertyStatus({ id, status }: UpdatePropertyStatusDTO) {
    const property = this.getPropertyById({ id });
    property.status = status;
    return property;
  }
}
