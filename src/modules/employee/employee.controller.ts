import { Body, Controller, Get, Param } from '@nestjs/common';

import { EmployeeService } from './employee.service';
import { FilterEmployeeBody, GetEmployeeParam } from './employee.interface';

@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get('/')
  async getEmployees() {
    return this.employeeService.getEmployees();
  }

  @Get('/filter')
  async filterEmployees(@Body() body: FilterEmployeeBody) {
    return this.employeeService.filterEmployees(body);
  }

  @Get('/:uuid')
  async getEmployeeById(@Param() params: GetEmployeeParam) {
    return this.employeeService.filterEmployeeById(params);
  }
}
