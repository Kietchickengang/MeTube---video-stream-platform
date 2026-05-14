import cors from 'cors';

const cors_config = {
    // Allowed front-end access
    origin: [
        'http://localhost:5173',
        'http://localhost:8001',
    ],
    // Allowed methods
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
    // Allowed headers
    allowedHeaders: '*',
    // For session/cookie
    credentials: true
}

export const cors_rule = cors(cors_config);