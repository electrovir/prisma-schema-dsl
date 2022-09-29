import {
    AUTO_INCREMENT,
    CallExpression,
    CUID,
    DataSource,
    DataSourceProvider,
    DataSourceURLEnv,
    Enum,
    FieldKind,
    Generator,
    Model,
    NOW,
    ObjectField,
    ScalarField,
    ScalarFieldDefault,
    ScalarType,
    Schema,
    UUID,
} from './types';

const NAME_REGEXP = /[A-Za-z][A-Za-z0-9_]*/;
export const OPTIONAL_LIST_ERROR_MESSAGE =
    'Invalid modifiers: You cannot combine isRequired: false and isList: true - optional lists are not supported.';

/** Creates a schema AST object */
export function createSchema({
    models,
    enums,
    dataSource,
    generators = [],
}: {
    models: Model[];
    enums: Enum[];
    dataSource?: DataSource | undefined;
    generators?: Generator[] | undefined;
}): Schema {
    return {
        dataSource,
        generators,
        enums,
        models,
    };
}

/** Creates an enum AST object */
export function createEnum({
    name,
    values,
    documentation,
}: {
    name: string;
    values: string[];
    documentation?: string | undefined;
}): Enum {
    validateName(name);
    return {
        name,
        values,
        documentation,
    };
}

/** Creates a model AST object */
export function createModel({
    name,
    fields,
    documentation,
}: {
    name: string;
    fields: Array<ScalarField | ObjectField>;
    documentation?: string | undefined;
}): Model {
    validateName(name);
    return {
        name,
        fields,
        documentation,
    };
}

/** Creates a scalar field AST object Validates given name argument */
export function createScalarField({
    name,
    type,
    isList = false,
    isRequired = false,
    isUnique = false,
    isId = false,
    isUpdatedAt = false,
    defaultValue = null,
    documentation,
}: {
    name: string;
    type: ScalarType;
    isList?: boolean | undefined;
    isRequired?: boolean | undefined;
    isUnique?: boolean | undefined;
    isId?: boolean | undefined;
    isUpdatedAt?: boolean | undefined;
    defaultValue?: ScalarFieldDefault | undefined;
    documentation?: string | undefined;
}): ScalarField {
    validateName(name);
    validateScalarDefault({
        type,
        value: defaultValue,
    });
    validateModifiers({
        isRequired,
        isList,
    });
    return {
        name,
        isList,
        isRequired,
        isUnique,
        kind: FieldKind.Scalar,
        type,
        isId,
        isUpdatedAt,
        default: defaultValue,
        documentation,
    };
}

function validateScalarDefault({type, value}: {type: ScalarType; value: ScalarFieldDefault}) {
    if (value === null) {
        return;
    }
    switch (type) {
        case ScalarType.String: {
            if (
                !(
                    typeof value === 'string' ||
                    (value instanceof CallExpression &&
                        (value.callee === UUID || value.callee === CUID))
                )
            ) {
                throw new Error(
                    'Default must be a string or a call expression to uuid() or cuid()',
                );
            }
            return;
        }
        case ScalarType.Boolean: {
            if (typeof value !== 'boolean') {
                throw new Error('Default must be a boolean');
            }
            return;
        }
        case ScalarType.Int: {
            if (
                !(
                    typeof value === 'number' ||
                    (value instanceof CallExpression && value.callee === AUTO_INCREMENT)
                )
            ) {
                throw new Error('Default must be a number or call expression to autoincrement()');
            }
            return;
        }
        case ScalarType.Float: {
            if (!(typeof value == 'number')) {
                throw new Error('Default must be a number');
            }
            return;
        }
        case ScalarType.DateTime: {
            if (
                !(
                    typeof value === 'string' ||
                    (value instanceof CallExpression && value.callee === NOW)
                )
            ) {
                throw new Error('Default must be a date-time string or a call expression to now()');
            }
            return;
        }
        case ScalarType.Json: {
            if (typeof value !== 'string') {
                throw new Error('Default must a JSON string');
            }
            return;
        }
        default: {
            throw new Error(`Unknown type ${type}`);
        }
    }
}

/** Creates an object field AST object Validates given name argument */
export function createObjectField({
    name,
    type,
    isList = false,
    isRequired = false,
    relationName = null,
    relationFields = [],
    relationReferences = [],
    relationOnDelete = 'NONE',
    documentation,
}: {
    name: string;
    type: string;
    isList?: boolean | undefined;
    isRequired?: boolean | undefined;
    relationName?: string | null | undefined;
    relationFields?: string[] | undefined;
    relationReferences?: string[] | undefined;
    relationOnDelete?: 'NONE' | undefined;
    documentation?: string | undefined;
}): ObjectField {
    validateName(name);
    validateModifiers({
        isRequired,
        isList,
    });
    return {
        name,
        isList,
        isRequired,
        kind: FieldKind.Object,
        type,
        relationName,
        relationToFields: relationFields,
        relationToReferences: relationReferences,
        relationOnDelete,
        documentation,
    };
}

function validateName(name: string): void {
    if (!name.match(NAME_REGEXP)) {
        throw new Error(
            `Invalid name: "${name}". Name must start with a letter and can contain only letters, numbers and underscores`,
        );
    }
}

function validateModifiers({isRequired, isList}: {isRequired: boolean; isList: boolean}): void {
    if (!isRequired && isList) {
        throw new Error(OPTIONAL_LIST_ERROR_MESSAGE);
    }
}

/** Creates a data source AST object */
export function createDataSource({
    name,
    provider,
    url,
}: {
    name: string;
    provider: DataSourceProvider;
    url: string | DataSourceURLEnv;
}): DataSource {
    return {
        name,
        provider,
        url,
    };
}

/** Creates a generator AST object */
export function createGenerator({
    name,
    provider,
    output = null,
    binaryTargets = [],
}: {
    name: string;
    provider: string;
    output?: string | null | undefined;
    binaryTargets?: string[] | undefined;
}): Generator {
    return {
        name,
        provider,
        output,
        binaryTargets,
    };
}
