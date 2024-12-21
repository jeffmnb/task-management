import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { Property } from './property.types';
import {
  CreateNewPropertyDto,
  GetPropertyByIdDTO,
  UpdatePropertyStatusDTO,
} from './dtos/property.dtos';

@Controller('property')
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get()
  getAllProperties(): Property[] {
    return this.propertyService.getAllProperties();
  }

  @Get('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  getPropertyById(@Param() { id }: GetPropertyByIdDTO): Property {
    return this.propertyService.getPropertyById({ id });
  }

  @Post('/create')
  @HttpCode(201)
  @UsePipes(new ValidationPipe({ transform: true }))
  createNewProperty(@Body() property: CreateNewPropertyDto): Property {
    return this.propertyService.createNewProperty(property);
  }

  @Patch('/:id/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  updatePropertyStatus(
    @Param('id') id: string,
    @Body() { status }: UpdatePropertyStatusDTO,
  ) {
    return this.propertyService.updatePropertyStatus({ id, status });
  }
}
