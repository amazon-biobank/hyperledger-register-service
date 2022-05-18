import { revokeUser } from "../connection/RevokeUser";

export const revokeUserHandler = async (req, res) => {
    console.log(req.body);
    let userId = req.body.userId;
    if (!userId) {
      return res.send("Missing userId parameter")
    }
  
    try{
      let response = await revokeUser(userId);
      res.send(response);
    }
    catch(e){
      if (e instanceof Error){
        res.status(500).send(e.message);
      }
    }
  }