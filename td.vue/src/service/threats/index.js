import { v4 } from 'uuid';

import models from './models/index.js';
import { tc } from '../../i18n/index.js';

const valuesToTranslations = {
    Confidentiality: 'threats.model.cia.confidentiality',
    Integrity: 'threats.model.cia.integrity',
    Availability: 'threats.model.cia.availability',

    Distributed: 'threats.model.die.distributed',
    Immutable: 'threats.model.die.immutable',
    Ephemeral: 'threats.model.die.ephemeral',

    Linkability: 'threats.model.linddun.linkability',
    Identifiability: 'threats.model.linddun.identifiability',
    'Non-repudiation': 'threats.model.linddun.nonRepudiation',
    Detectability: 'threats.model.linddun.detectability',
    'Disclosure of information': 'threats.model.linddun.disclosureOfInformation',
    Unawareness: 'threats.model.linddun.unawareness',
    'Non-compliance': 'threats.model.linddun.nonCompliance',
/**
 * @todo : the current structure doesn´t allow frameworks to have categories with the same name.
 * This is a problem for plot4ai & linddun.
 * However, since this mapping object seems to be used only for migration and plot4ai didn´t exist
 * when version 1 was current, it should not be a problem that plot4ai is not added here
 *
 *
    'Technique & Processes': 'threats.model.plot4ai.techniqueProcesses',
    'Accessibility': 'threats.model.plot4ai.accessibility',
    'Identifiability & Linkability': 'threats.model.plot4ai.identifiabilityLinkability',
    Security: 'threats.model.plot4ai.security',
    Safety: 'threats.model.plot4ai.safety',
    Unawareness: 'threats.model.plot4ai.unawareness',
    'Ethics & Human Rights': 'threats.model.plot4ai.ethicsHumanRights',
    'Non-compliance': 'threats.model.plot4ai.nonCompliance'
*/
    Spoofing: 'threats.model.stride.spoofing',
    Tampering: 'threats.model.stride.tampering',
    Repudiation: 'threats.model.stride.repudiation',
    'Information disclosure': 'threats.model.stride.informationDisclosure',
    'Denial of service': 'threats.model.stride.denialOfService',
    'Elevation of privilege': 'threats.model.stride.elevationOfPrivilege'
};

const convertToTranslationString = (val) => valuesToTranslations[val];

export const createNewTypedThreat = function (modelType, cellType) {
    if (!modelType) {
        modelType = 'STRIDE';
    }
    let title, type;

    switch (modelType) {

    case 'CIA':
        title = tc('threats.generic.cia');
        type = tc('threats.model.cia.confidentiality');
        break;

    case 'DIE':
        title = tc('threats.generic.die');
        type = tc('threats.model.die.distributed');
        break;

    case 'LINDDUN':
        title = tc('threats.generic.linddun');
        type = tc('threats.model.linddun.linkability');
        break;

    case 'PLOT4ai':
        title = tc('threats.generic.plot4ai');
        if (cellType === 'tm.Actor') {
            type = tc('threats.model.plot4ai.accessibility');
        } else {
            type = tc('threats.model.plot4ai.techniqueProcesses');
        }
        break;

    case 'STRIDE':
        title = tc('threats.generic.stride');
        if (cellType === 'tm.Actor' || cellType === 'tm.Process') {
            type = tc('threats.model.stride.spoofing');
        } else {
            type = tc('threats.model.stride.tampering');
        }
        break;

    default:
        title = tc('threats.generic.default');
        type = tc('threats.model.stride.spoofing');
        break;
    }

    return {
        id: v4(),
        title,
        status: 'Open',
        severity: 'Medium',
        type,
        description: tc('threats.description'),
        mitigation: tc('threats.mitigation'),
        modelType,
        new: true,
        number: 0,
        score: ''
    };
};

const hasOpenThreats = (data) => !!data && !!data.threats &&
    data.threats.filter(x => x.status.toLowerCase() === 'open').length > 0;

const filter = (diagrams, filters) => {
    return diagrams
        .flatMap(x => x.cells)
        .filter(x => !!x.data && !!x.data.threats)
        .flatMap(x => x.data.threats)
        .filter(x => filterForDiagram(x, filters))
        .filter(x => !!x);
};

const filterForDiagram = (data, filters) => {
    if (!filters.showOutOfScope && data.outOfScope) {
        return [];
    }

    if (!data.threats) {
        return [];
    }

    return data.threats.filter(x => filters.showMitigated || x.status.toLowerCase() !== 'mitigated');
};

export default {
    convertToTranslationString,
    filter,
    filterForDiagram,
    getModelByTranslation: models.getByTranslationValue,
    hasOpenThreats
};
