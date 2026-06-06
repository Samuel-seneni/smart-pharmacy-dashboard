const DEFAULT_JWT_SECRET = "smart-pharmacy-dev-secret-change-me-in-production";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    console.warn("⚠️ JWT_SECRET is not set. Using fallback secret for this deployment.");
  }

  return process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
};

module.exports = {
  DEFAULT_JWT_SECRET,
  getJwtSecret,
};
