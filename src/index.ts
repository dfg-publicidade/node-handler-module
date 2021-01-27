import Url from '@dfgpublicidade/node-url-module';
import { validateBr } from 'js-brasil';
import validator from 'validator';

/* Module */
class Validation {
    public static positive(num: number): boolean {
        if (!num) {
            return true;
        }
        return num >= 0;
    }

    public static hexColor(color: string): boolean {
        if (!color) {
            return true;
        }
        return /^#[0-9a-fA-F]{6}$/.test(color);
    }

    public static url(url: string): boolean {
        if (!url) {
            return true;
        }

        return Url.matchUrl(url);
    }

    public static uri(uri: string): boolean {
        if (!uri) {
            return true;
        }

        return Url.matchUri(uri);
    }

    public static isoCode(code: string): boolean {
        if (!code) {
            return true;
        }

        return validator.isISO31661Alpha3(code);
    }

    public static cpf(cpf: string): boolean {
        if (!cpf) {
            return true;
        }

        return validateBr.cpf(cpf);
    }

    public static cnpj(cnpj: string): boolean {
        if (!cnpj) {
            return true;
        }

        return validateBr.cnpj(cnpj);
    }

    public static telephone(telephone: string): boolean {
        if (!telephone) {
            return true;
        }

        return validateBr.telefone(telephone);
    }

    public static cellphone(cellphone: string): boolean {
        if (!cellphone) {
            return true;
        }

        return validateBr.celular(cellphone);
    }

    public static email(email: string): boolean {
        if (!email) {
            return true;
        }

        return validator.isEmail(email);
    }

    public static cep(cep: string): boolean {
        if (!cep) {
            return true;
        }

        return validateBr.cep(cep);
    }

    public static fullName(nome: string): boolean {
        if (!nome) {
            return true;
        }

        nome = nome.trim();

        // eslint-disable-next-line no-magic-numbers
        return nome.length > 3 && nome.indexOf(' ') !== -1;
    }
}

export default Validation;
