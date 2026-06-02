const SUPER_ADMIN_EMAIL = "admin@pharmacy.com";

const isSuperAdmin = (user) => {
  if (!user) return false;

  return (
    user.email === SUPER_ADMIN_EMAIL ||
    user.role === "super_admin"
  );
};

module.exports = {
  SUPER_ADMIN_EMAIL,
  isSuperAdmin,
};