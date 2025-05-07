import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.sendStatus(401); // Invalid token

        // Save decoded token info in req.session.user
        req.session = {
            user: {
                id: decoded.id,
                role: decoded.role
            }
        };

        next();
    });
};

export default verifyJWT;
