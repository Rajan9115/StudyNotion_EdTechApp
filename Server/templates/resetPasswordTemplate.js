const resetPasswordTemplate = (username, resetUrl) => {
  return `
  <div style="font-family:'Segoe UI', Arial, sans-serif; background:#f2f6fc; padding:40px; display:flex; justify-content:center;">
    <div style="max-width:520px; width:100%; background:#ffffff; border-radius:14px; box-shadow:0 4px 25px rgba(0,0,0,0.10); padding:35px;">

      <!-- Header -->
      <div style="text-align:center;">
        <h2 style="color:#2d89ef; font-size:26px; margin-bottom:5px;">
          Reset Your Password
        </h2>
        <p style="color:#555; font-size:15px; margin-top:0;">
          Hello <b>${username}</b>, we received a request to reset your password.
        </p>
      </div>

      <!-- Illustration Icon -->
      <div style="text-align:center; margin:25px 0;">
        <div style="
          width:85px; 
          height:85px; 
          border-radius:50%; 
          background:#e9f3ff; 
          display:flex; 
          justify-content:center; 
          align-items:center;
          margin:auto;
        ">
          <span style="font-size:42px; color:#2d89ef;">🔑</span>
        </div>
      </div>

      <!-- Info Text -->
      <p style="color:#333; font-size:15px; line-height:1.7;">
        You recently requested to reset your password for your <b>StudyNotion</b> account.
        Click the button below to choose a new password:
      </p>

      <!-- Reset Button -->
      <div style="text-align:center; margin:28px 0;">
        <a href="${resetUrl}" 
           style="
             background:#2d89ef; 
             color:white; 
             padding:14px 28px; 
             text-decoration:none; 
             border-radius:8px; 
             font-size:16px;
             font-weight:600;
             display:inline-block;
           ">
          Reset Password
        </a>
      </div>

      <!-- Reset Link (fallback) -->
      <p style="color:#777; font-size:13px; text-align:center; margin-top:0;">
        Or copy this link into your browser:
      </p>
      <p style="
        word-break:break-all; 
        background:#f1f5ff; 
        padding:10px 12px; 
        border-left:4px solid #2d89ef; 
        border-radius:6px; 
        font-size:13px; 
        color:#2a4d9b;
      ">
        ${resetUrl}
      </p>

      <!-- Alert Box -->
      <div style="
        background:#fff5e8;
        padding:15px 20px;
        border-left:5px solid #ffb347;
        border-radius:6px;
        margin:25px 0;
      ">
        <p style="color:#b06100; margin:0; font-size:14px;">
          ⚠️ <b>This link is valid for only 15 minutes.</b>  
          If you didn’t request a password reset, please ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align:center; margin-top:20px; border-top:1px solid #eee; padding-top:15px;">
        <p style="color:#777; font-size:13px; margin:0;">
          Stay secure — keep your account protected.
        </p>
        <p style="color:#2d89ef; font-weight:600; margin-top:10px; font-size:14px;">
          — Team StudyNotion
        </p>
      </div>

    </div>
  </div>
  `;
};

module.exports = resetPasswordTemplate;
