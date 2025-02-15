const bcrypt = require("bcrypt")
const { userService } = require(".")



const loginUserWithEmailAndPassword =  async(email,password)=>{
  const user = await userService.getUserByEmail(email);;
  if(!user || !(await user.isPasswordMatch(password))){
    throw new Error("Invalid credentials")
  }

  return user;
}

module.exports = {
    loginUserWithEmailAndPassword
}