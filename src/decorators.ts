/**
 * Decorators para o Model Kit
 */

import 'reflect-metadata';
import { registerModelMetadata, registerFieldMetadata } from './metadata';
import { FieldOptions, ModelOptions } from './types';

/**
 * Decorator para marcar uma classe como um modelo
 * @param options Opções do modelo
 */
export function Model(options: ModelOptions = {}): ClassDecorator {
  return (target: any) => {
    const tableName = options.tableName || target.name.toLowerCase();
    registerModelMetadata(target, { tableName });
    return target;
  };
}

/**
 * Decorator para marcar uma propriedade como um campo do modelo
 * @param options Opções do campo
 */
export function Field(options: FieldOptions = {}): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const fieldName = propertyKey.toString();
    
    registerFieldMetadata(target.constructor, propertyKey.toString(), {
      fieldName,
      options
    });
    
    return;
  };
}
