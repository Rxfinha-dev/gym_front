export function addMaskToCNPJ(cnpj) {
    // Remove todos os caracteres que não são números
    cnpj = cnpj.replace(/\D/g, "");

    // Adiciona a máscara do CNPJ
    cnpj = cnpj.replace(/^(\d{2})(\d)/, "$1.$2");
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, ".$1/$2");
    cnpj = cnpj.replace(/(\d{4})(\d)/, "$1-$2");

    return cnpj;
}