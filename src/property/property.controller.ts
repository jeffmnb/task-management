import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from './property.types';

@Controller('property')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get()
  getAllProperties(): Property[] {
    return this.propertyService.getAllProperties();
  }

  @Get('/:id')
  getPropertyById(@Param('id') id: string): Property {
    return this.propertyService.getPropertyById(id);
  }

  @Post('/create')
  @HttpCode(201)
  createNewProperty(@Body() property: Property): Property {
    return this.propertyService.createNewProperty(property);
  }
}
