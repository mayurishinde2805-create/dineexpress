// Simplified auth middleware for DineExpress


// NOTE: Since we are currently using a simplified JWT-less auth for demo/dev,
// we will check role from a custom header or simpler mechanism for now.
// For a production app, we would verify a real JWT token here.

exports.adminAuth = (req, res, next) => {
    // Check if the request is coming from an admin session
    // This is a placeholder for real JWT verification
    const userRole = req.headers['role'] || req.headers['x-user-role'];

    if (userRole === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Admin access denied" });
    }
};

exports.kitchenAuth = (req, res, next) => {
    const userRole = req.headers['role'] || req.headers['x-user-role'];

    if (userRole === 'kitchen' || userRole === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Kitchen access denied" });
    }
};
