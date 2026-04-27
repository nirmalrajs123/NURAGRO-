const pool = require('./config/db');
const bcrypt = require('bcryptjs');

async function resetPassword() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);
  
  await pool.query('UPDATE "Users" SET password = $1 WHERE username = $2', [hashedPassword, 'admin']);
  console.log("Password for 'admin' has been reset to 'admin123'");
  process.exit(0);
}

resetPassword();
