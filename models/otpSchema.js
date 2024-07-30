const { DataTypes, Op} = require('sequelize');
const sequelize = require('../config/dbConfig');
const otpGenerator = require('otp-generator');
const mailSender = require('../utils/mailSender');

const Otp = sequelize.define('Otp',{
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      otp:{
        type: DataTypes.STRING,
        allowNull: false
      },
      otpToken:{
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      }
},{
    tableName: 'otps',
    timestamps:true,
    hooks:{
      beforeCreate: async (otp) => {
        if (otp.isNewRecord) {
          await Otp.sendVerificationEmail(otp.email, otp.otp);
        }
      }
    }
})

Otp.removeExpiredOtps = async () => {
  const expirationTime = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes
  await Otp.destroy({
    where: {
      createdAt: {
        [Op.lt]: expirationTime
      }
    }
  });
};

Otp.sendVerificationEmail= async(email, otp)=> {
    try {
      const mailResponse = await mailSender(
        email,
        "Verification Email",
        `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`
      );
      console.log("Email sent successfully: ", mailResponse);
    } catch (error) {
      console.log("Error occurred while sending email: ", error);
      throw error;
    }

}
module.exports = Otp