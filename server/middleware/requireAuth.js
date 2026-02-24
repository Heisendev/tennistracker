export const requireAuth = (req, res, next) => {
    console.log("req", req);
    if (!req.session?.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};
