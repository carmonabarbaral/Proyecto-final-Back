const errorCodes = {
    // Errores comunes al crear un producto:
    PRODUCT_NAME_REQUIRED: 'El nombre del producto es obligatorio.',
    PRODUCT_DESCRIPTION_REQUIRED: 'La descripción del producto es obligatoria.',
    PRODUCT_PRICE_REQUIRED: 'El precio del producto es obligatorio.',
    PRODUCT_PRICE_INVALID: 'El precio del producto debe ser un número válido.',
  
    // Errores comunes al agregar un producto al carrito:
    PRODUCT_NOT_FOUND: 'El producto no existe.',
    PRODUCT_ALREADY_IN_CART: 'El producto ya está en el carrito.',
    QUANTITY_INVALID: 'La cantidad del producto debe ser un número válido.',
  };
  
  module.exports = errorCodes;