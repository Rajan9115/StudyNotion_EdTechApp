const changePasswordTemplate = (username) => {
  return `
  <div style="font-family:'Segoe UI', Arial, sans-serif; background:#f5f7fb; padding:40px; display:flex; justify-content:center;">
    <div style="max-width:520px; width:100%; background:#ffffff; border-radius:14px; box-shadow:0 4px 25px rgba(0,0,0,0.10); padding:35px;">

      <!-- Header -->
      <div style="text-align:center;">
        <h2 style="color:#2d89ef; font-size:26px; margin-bottom:5px;">
          Password Updated Successfully
        </h2>
        <p style="color:#555; font-size:15px; margin-top:0;">
          Hi <b>${username}</b>, your account is now more secure.
        </p>
      </div>

      <!-- Success Icon -->
      <div style="text-align:center; margin:25px 0;">
        <div style="
          width:80px; 
          height:80px; 
          border-radius:50%; 
          background:#e8f3ff; 
          display:flex; 
          justify-content:center; 
          align-items:center;
          margin:auto;
        ">
          <span style="font-size:40px; color:#2d89ef;">✔️</span>
        </div>
      </div>

      <!-- Message -->
      <p style="color:#333; font-size:15px; line-height:1.7;">
        We wanted to let you know that the password for your <b>StudyNotion</b> account
        has been changed successfully.  
        If you made this change, no further action is needed.
      </p>

      <p style="color:#333; font-size:15px; line-height:1.7;">
        If this wasn't you, please reset your password immediately or contact our support team.
      </p>

      <!-- Security Tip Box -->
      <div style="
        background:#f0f7ff;
        padding:15px 20px;
        border-left:5px solid #2d89ef;
        border-radius:6px;
        margin:25px 0;
      ">
        <p style="color:#2a4d9b; margin:0; font-size:14px;">
          🔐 <b>Security Tip:</b> Avoid using the same password across multiple platforms.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align:center; margin-top:20px; border-top:1px solid #eee; padding-top:15px;">
        <p style="color:#777; font-size:13px; margin:0;">
          If you did not request this password change, please secure your account.
        </p>
        <p style="color:#2d89ef; font-weight:600; margin-top:10px; font-size:14px;">
          — Team StudyNotion
        </p>
      </div>

    </div>
  </div>
  `;
};

module.exports = changePasswordTemplate;
