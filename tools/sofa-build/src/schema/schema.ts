import { Schema } from 'ajv';

/**
 * An object which describes app-specific properties for a project.
 */
export interface App {
  friendlyName: string;
}

/**
 * An object which describes library-specific properties for a project.
 */
export interface Lib {
  objectName: string;
}

/**
 * An object which describes the project itself.
 */
export interface Meta {
  name: string;
}

/**
 * An object which configures properties of the project build process.
 */
export interface Build {
  backend: string;
  src: string;
  dist: string;
  umdDist: string;
  types: string;
}

/**
 * An object describing a project and how it should be built.
 */
export interface BuildFile {
  meta: Meta;
  app?: App;
  lib?: Lib;
  build?: Build;
}

/*
 * Sofa Build File schema v1.
 */
const schema: Schema = {
  title: 'Sofa Build File',
  type: 'object',
  properties: {
    meta: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        schema: {
          type: 'string',
        },
      },
      required: [
        'name',
      ],
      additionalProperties: false,
    },
    lib: {
      type: 'object',
      properties: {
        objectName: {
          type: 'string',
        },
      },
      required: [
        'objectName',
      ],
      additionalProperties: false,
    },
    app: {
      type: 'object',
      properties: {
        friendlyName: {
          type: 'string',
        },
      },
      required: [
        'friendlyName',
      ],
      additionalProperties: false,
    },
    build: {
      type: 'object',
      properties: {
        backend: {
          type: 'string',
        },
        src: {
          type: 'string',
        },
        dist: {
          type: 'string',
        },
        umdDist: {
          type: 'string',
        },
        types: {
          type: 'string',
        },
        clean: {
          type: 'boolean'
        },
      },
      additionalProperties: false,
    },
  },
  required: [
    'meta',
  ],
  oneOf: [
    {
      required: [
        'lib',
      ],
    },
    {
      required: [
        'app',
      ],
    },
  ],
  additionalProperties: false,
};

export default schema;
