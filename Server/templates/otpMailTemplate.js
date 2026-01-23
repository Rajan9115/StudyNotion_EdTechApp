const otpTemplate = (otp) => {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f7fa; padding:40px; display:flex; justify-content:center;">
    <div style="max-width:520px; width:100%; background:white; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.10); padding:30px;">
      
      <!-- Header -->
      <div style="text-align:center;">
        <h2 style="color:#4A90E2; margin-bottom:5px; font-size:26px;">StudyNotion Signup Verification</h2>
        <p style="color:#555; margin-top:0; font-size:15px;">
          Use the OTP below to verify your email and complete your registration.
        </p>
      </div>

      <!-- OTP Box -->
      <div style="margin:30px auto; text-align:center;">
        <div style="
          font-size:42px; 
          font-weight:700; 
          letter-spacing:10px; 
          background:#eef4ff; 
          padding:15px 20px; 
          border-radius:10px;
          color:#2a4d9b;
          border:1px solid #d4e1ff;
          display:inline-block;
        ">
          ${otp}
        </div>
      </div>

      <!-- Message -->
      <p style="color:#333; font-size:14px; line-height:1.7;">
        You're just one step away from joining <b>StudyNotion</b> — India's most powerful learning platform.
        Use the above <b>One-Time Password (OTP)</b> to verify your email address and complete your signup.
      </p>

      <p style="color:#333; font-size:14px; line-height:1.7;">
        This OTP is valid for the next <b>5 minutes</b>. Please do not share this code with anyone.
      </p>

      <!-- Footer -->
      <div style="margin-top:30px; border-top:1px solid #eee; padding-top:15px; text-align:center;">
        <p style="color:#777; font-size:13px; margin:0;">
          If you did not attempt to sign up for StudyNotion, please ignore this email.
        </p>
        <p style="color:#4A90E2; font-weight:600; margin-top:10px; font-size:14px;">
          — Team StudyNotion
        </p>
      </div>

    </div>
  </div>
  `;
};

module.exports = otpTemplate;
