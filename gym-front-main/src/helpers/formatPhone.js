export const formatPhone = (phone) => {
    let formattedPhone;
    
    if (phone.length === 11) {
        // Formato para 11 dígitos: (XX) XXXXX-XXXX
        formattedPhone = phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 10) {
        // Formato para 10 dígitos: (XX) XXXX-XXXX
        formattedPhone = phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        // Telefone não reconhecido
        formattedPhone = phone;
    }
    
    return formattedPhone;
};