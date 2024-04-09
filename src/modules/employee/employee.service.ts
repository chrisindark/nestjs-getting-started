import { Injectable, Logger } from '@nestjs/common';

import { EmployeeRepository } from './employee.repository';
import { FilterEmployeeBody, GetEmployeeParam } from './employee.interface';
import { Employee } from './employee.model';
import { ServiceResponseStatus } from '../../constants/enums';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async getEmployees() {
    try {
      const employees = await this.employeeRepository.getEmployees();
      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response: employees,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);

      return {
        success: false,
        status: ServiceResponseStatus.FAIL,
        response: null,
      };
    }
  }

  async getEmployeeById(uuid: string) {
    return this.employeeRepository.getEmployeeById(uuid);
  }

  async createEmployee(employee: Employee) {
    return this.employeeRepository.createEmployee(employee);
  }

  async updateEmployeeName(uuid: string, firstName: string) {
    return this.employeeRepository.updateEmployeeName(uuid, firstName);
  }

  async filterEmployeeById(params: GetEmployeeParam) {
    try {
      const { uuid } = params;
      const result = await this.employeeRepository
        .getMapper()
        .find({ id: uuid });
      const response = result.toArray();
      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      return {
        success: false,
        status: ServiceResponseStatus.FAIL,
        response: null,
      };
    }
  }
  async filterEmployees(body: FilterEmployeeBody) {
    try {
      //   const { limit, firstName, lastName } = body;

      const firstName = 'Chris';
      //   const lastName = 'Paul';
      const limit = 10;
      const queryParams = [];
      const whereParams = [];
      let whereClause = `WHERE`;
      let limitClause = ``;

      //   console.log(limit, firstName, lastName);

      if (firstName?.length) {
        // whereClause += ` AND first_name = ? `;
        whereParams.push(`first_name = ?`);
        queryParams.push(firstName);
      }

      //   if (lastName?.length) {
      //     // whereClause += ` AND last_name = ? `;
      //     whereParams.push(`last_name = ?`);
      //     queryParams.push(lastName);
      //   }

      if (limit) {
        limitClause += `LIMIT ${limit}`;
      }

      whereClause = whereParams.length
        ? ` WHERE ${whereParams.join(` AND `)} `
        : ``;

      const query = `
      SELECT id, first_name, last_name, created_at, updated_at FROM employee
      ${whereClause}
      ${limitClause}
      `;
      //   console.log(query);
      //   console.log(queryParams);
      const result = await this.employeeRepository
        .getClient()
        .execute(query, queryParams);
      const response = result.rows;

      return {
        success: true,
        status: ServiceResponseStatus.SUCCESS,
        response,
      };
    } catch (e) {
      this.logger.error(e.message, e.stack);

      return {
        success: false,
        status: ServiceResponseStatus.FAIL,
        response: null,
      };
    }
  }
}
