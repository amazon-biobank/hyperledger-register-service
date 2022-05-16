import { v4 as uuidv4 } from 'uuid';
import { registerUser } from '../connection/RegisterUser';

export const registerUserHandler = async (req, res) => {
    console.log(req.body);
    let userId = req.body.userId;
    if (!userId) {
      return res.send("Missing userId parameter")
    }
    //USING UUID FOR DEVELOP PURPOSES
    userId = uuidv4();
    let response = await registerUser(userId);
  
    // Trocar por exception
    if ("error" in response) {
      res.status(500).send(response.error);
    } else {
      res.send(response);
    }
}
