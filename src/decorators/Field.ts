export function Field(type: string): PropertyDecorator {
  return (target, propertyKey) => {
    const fields = Reflect.getMetadata('fields', target.constructor) || [];
    fields.push({ name: propertyKey as string, type });
    Reflect.defineMetadata('fields', fields, target.constructor);
  };
}