const roles = {
    '/api/products/create': ['admin'],
    '/api/products/update': ['admin'],
    '/api/products/delete': ['admin'],
    '/api/chat/messages': ['user'],
    '/api/cart/items': ['user'],
};
module.export = roles