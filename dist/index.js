"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_url_module_1 = __importDefault(require("@dfgpublicidade/node-url-module"));
const js_brasil_1 = require("js-brasil");
const validator_1 = __importDefault(require("validator"));
/* Module */
class Validation {
    static positive(num) {
        if (!num) {
            return true;
        }
        return num >= 0;
    }
    static hexColor(color) {
        if (!color) {
            return true;
        }
        return /^#[0-9a-fA-F]{6}$/.test(color);
    }
    static url(url) {
        if (!url) {
            return true;
        }
        return node_url_module_1.default.matchUrl(url);
    }
    static uri(uri) {
        if (!uri) {
            return true;
        }
        return node_url_module_1.default.matchUri(uri);
    }
    static isoCode(code) {
        if (!code) {
            return true;
        }
        return validator_1.default.isISO31661Alpha3(code);
    }
    static cpf(cpf) {
        if (!cpf) {
            return true;
        }
        return js_brasil_1.validateBr.cpf(cpf);
    }
    static cnpj(cnpj) {
        if (!cnpj) {
            return true;
        }
        return js_brasil_1.validateBr.cnpj(cnpj);
    }
    static telephone(telephone) {
        if (!telephone) {
            return true;
        }
        return js_brasil_1.validateBr.telefone(telephone);
    }
    static cellphone(cellphone) {
        if (!cellphone) {
            return true;
        }
        return js_brasil_1.validateBr.celular(cellphone);
    }
    static email(email) {
        if (!email) {
            return true;
        }
        return validator_1.default.isEmail(email);
    }
    static cep(cep) {
        if (!cep) {
            return true;
        }
        return js_brasil_1.validateBr.cep(cep);
    }
    static fullName(nome) {
        if (!nome) {
            return true;
        }
        nome = nome.trim();
        // eslint-disable-next-line no-magic-numbers
        return nome.length > 3 && nome.indexOf(' ') !== -1;
    }
}
exports.default = Validation;
