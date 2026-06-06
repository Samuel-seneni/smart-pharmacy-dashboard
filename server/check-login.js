const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { connectDB } = require('./config/db');

(async () => {
  await connectDB();
  const user = await User.scope('withPassword').findOne({ where: { email: 'admin@pharmacy.com' } });
  console.log('USER_FOUND', !!user);
  if (user) {
    console.log('USER_DATA', {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      passwordPreview: user.password ? user.password.slice(0, 40) : null,
    });
    const ok = await bcrypt.compare('Admin@123', user.password);
    console.log('COMPARE_OK', ok);
  }
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
