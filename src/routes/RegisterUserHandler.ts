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
    try{
      let response = await registerUser(userId);
      res.send(response);
    }
    catch(e){
      if (e instanceof Error){
        res.status(500).send({
          error: e.message
        });
      }
    }
}
