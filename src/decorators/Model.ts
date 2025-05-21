import 'reflect-metadata';

export function Model(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata('model', true, target);
  };
}
