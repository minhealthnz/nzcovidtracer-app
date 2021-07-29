import _ from "lodash";

export default class Realm {
  schema: any = [];
  data: any = [];
  constructor(params: any) {
    _.each(params.schema, (schema: string) => {
      this.data[schema] = [];
    });
    this.schema = params.schema;
  }
  objects(schemaName: string) {
    return this.data[schemaName];
  }
  write(fn: any) {
    fn();
  }
  create(schemaName: string, data: any) {
    this.data[schemaName].push(data);
    return data;
  }
}
