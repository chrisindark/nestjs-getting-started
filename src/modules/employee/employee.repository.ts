import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, mapping } from 'cassandra-driver';
// import { v4 as uuidv4 } from 'uuid';

import { Employee } from './employee.model';
import { CassandraService } from '../../utils/cassandra/cassandra.service';

@Injectable()
export class EmployeeRepository implements OnModuleInit {
  constructor(private readonly cassandraService: CassandraService) {}

  testClient: Client;
  employeeMapper: mapping.ModelMapper<Employee>;

  onModuleInit() {
    const mappingOptions: mapping.MappingOptions = {
      models: {
        Employee: {
          tables: ['employee'],
          mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
        },
      },
    };

    this.testClient = this.cassandraService.getTestClient();
    this.employeeMapper = this.cassandraService
      .createMapper(this.testClient, mappingOptions)
      .forModel('Employee');
  }

  getClient = () => {
    return this.testClient;
  };

  getMapper = () => {
    return this.employeeMapper;
  };

  async getEmployees() {
    return (await this.employeeMapper.findAll({ limit: 10 })).toArray();
  }

  async getEmployeeById(uuid: string) {
    return (await this.employeeMapper.find({ id: uuid })).toArray();
  }

  async createEmployee(employee: Employee) {
    return (await this.employeeMapper.insert(employee)).toArray();
  }

  async updateEmployeeName(uuid: string, firstName: string) {
    const employee = new Employee();
    employee.id = uuid;
    employee.firstName = firstName;
    return (
      await this.employeeMapper.update(employee, {
        fields: ['id', 'firstName'],
        ifExists: true,
      })
    ).toArray();
  }
}
