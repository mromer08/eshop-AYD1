const verifyRoles = (...allowedRoleCodes) => {
    return (req, res, next) => {
        if (!req.session.user || !req.session.user.role) {
            return res.sendStatus(401); // Unauthorized
        }
        const userRoleCode = req.session.user.role;

        if (!allowedRoleCodes.includes(userRoleCode)) {
            return res.sendStatus(403); // Forbidden
        }

        next();
    };
};

export default verifyRoles;
