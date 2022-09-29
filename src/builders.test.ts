import {expect} from 'chai';
import {describe, it} from 'mocha';
import {createObjectField, createScalarField, OPTIONAL_LIST_ERROR_MESSAGE} from './builders';
import {ScalarType} from './types';

const EXAMPLE_NAME = 'EXAMPLE_NAME';
const EXAMPLE_SCALAR_TYPE = ScalarType.String;
const EXAMPLE_TYPE = 'EXAMPLE_TYPE';

describe('createScalarField', () => {
    it('fails for invalid combination of optional list', () => {
        const isList = true;
        const isRequired = false;
        expect(() =>
            createScalarField(EXAMPLE_NAME, EXAMPLE_SCALAR_TYPE, isList, isRequired),
        ).to.throw(OPTIONAL_LIST_ERROR_MESSAGE);
    });
});

describe('createObjectField', () => {
    it('fails for invalid combination of optional list', () => {
        const isList = true;
        const isRequired = false;
        expect(() => createObjectField(EXAMPLE_NAME, EXAMPLE_TYPE, isList, isRequired)).to.throw(
            OPTIONAL_LIST_ERROR_MESSAGE,
        );
    });
});
