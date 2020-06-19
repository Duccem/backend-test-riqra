"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
    type User {
        id: ID!
        email: String!
        password: String!
        name: String
    }

    type Product {
        id: ID!
        name: String
        image: String
        brand: String
        price: Float
        userId: ID!
    }

    type Cart {
        id: ID!
        total: Float
        tax: Float
        subtotal: Float

    }

    type Order {
        id: ID!
        code: String
        total: Float
        tax: Float
        subtotal: Float
    }

    type AuthPayload {
        token: String
        user: User
    }

    type Mutation {
        signup(email: String!, password: String!, name: String!): AuthPayload
        login(email: String!, password: String!): AuthPayload
        createProduct(name: String!, brand: String!, price: Float!, image: Upload!): Product!
        updateProduct(id:ID!, name:String, brand: String, price:Float, image: Upload): Product!
        deleteProduct(id:ID!): String!
        createCart: Product!
        addProductToCart(id: ID!, productId:ID!, quantity: Float!): Product!
        removeProductFromCart(id: ID!, productId:ID!, quantity: Float!): Product!
        convertCartToOrder(id:ID!): Order
    }

    type Query {
        getProducts: [Product!]!
        getProduct(id:ID!): Product
        getCarts: [Cart!]!
        getCart(id: ID!): Cart
        getOrders: [Order!]!
        getOrder(id: ID!): Order
    }
    
`;
