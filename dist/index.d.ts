declare class Validation {
    static positive(num: number): boolean;
    static hexColor(color: string): boolean;
    static url(url: string): boolean;
    static uri(uri: string): boolean;
    static isoCode(code: string): boolean;
    static cpf(cpf: string): boolean;
    static cnpj(cnpj: string): boolean;
    static telephone(telephone: string): boolean;
    static cellphone(cellphone: string): boolean;
    static email(email: string): boolean;
    static cep(cep: string): boolean;
    static fullName(nome: string): boolean;
}
export default Validation;
