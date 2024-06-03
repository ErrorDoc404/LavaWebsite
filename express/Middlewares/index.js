let config = require("../../config");
const User = require('../../mongoose/database//schemas/User');

const Auth = (req, res, next) => {
  if (!req.user) return res.redirect(config.CallbackURL);
  else next();
};

const Administrator = async (req, res, next) => {
  try {
    const user = req.user; // Assuming user information is stored in req.user

    if (!user) {
      return res.status(403).send('Access denied. User not authenticated.');
    }

    // Fetch user data from the database
    const userData = await User.findOne({ discordId: user.discordId });

    console.log(userData.perms);

    if (userData && userData.perms === 'admin') {
      // User has administrative permissions, allow access to the route
      next();
    } else {
      // User does not have administrative permissions, deny access
      res.status(403).send('Access denied. Administrator permissions required.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const Owner = async (req, res, next) => {
  try{
    const user = req.user; // Assuming user information is stored in req.user
    const guildOwner = config.Admins;
    if(!user) return res.status(403).send('Access denied. User not authenticated.');

    if(guildOwner.includes(user.discordId)){
      next();
    }else{
      res.status(403).send('Access denied. Owner permissions required.');
    }
    
  } catch(e){
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
}


module.exports = { Auth, Administrator, Owner };