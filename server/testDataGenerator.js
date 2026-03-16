const { faker } = require('@faker-js/faker');

function generateUserData() {
    return {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: faker.phone.number()
    };
}

function generateProductData() {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        category: faker.commerce.department(),
        sku: faker.string.alphanumeric(8)
    };
}

function generateTestData(type, count = 1) {
    const data = [];

    for (let i = 0; i < count; i++) {
        switch (type.toLowerCase()) {
            case 'user':
                data.push(generateUserData());
                break;
            case 'product':
                data.push(generateProductData());
                break;
            default:
                data.push(generateUserData());
        }
    }

    return count === 1 ? data[0] : data;
}

module.exports = { generateUserData, generateProductData, generateTestData };