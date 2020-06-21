export default `
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
        products: [CartDetail]
    }

    type CartDetail {
        name: String
        image: String
        brand: String
        price: Float
        quantity: Float
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
        addProductToCart(id: ID!, productId:ID!, quantity: Float!): String!
        removeProductFromCart(id: ID!, productId:ID!, quantity: Float!): String!
        convertCartToOrder(id:ID!): Order
    }

    type Query {
        search(term: String!, page: Int!, limit:Int!): [Product!]!
        getCart(id: ID!): Cart
        getOrders: [Order!]!
    }
    
`;
